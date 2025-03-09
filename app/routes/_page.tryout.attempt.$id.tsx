import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { getUserData } from "~/auth/getUserData";
import { Submission, Tryout } from "~/auth/interface";
import { toast } from "sonner";
import { token } from "~/auth/token";
import { Modal, ModalCenter, ModalContent } from "~/components/elements/Modals";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { getSubmission, submitAnswers } from "~/hooks/submissions";
import { getTryout } from "~/hooks/tryouts";

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const formData = await request.formData();
  const tryoutId = formData.get("tryoutId") as string;
  const submissionId = formData.get("submissionId") as string;

  const answersData = JSON.parse(formData.get("answers") as string);

  try {
    const answers = Object.entries(answersData).map(([questionId, answer]) => {
      if ((answer as string).startsWith("choice_")) {
        return {
          questionId,
          choiceId: (answer as string).replace("choice_", ""),
        };
      } else {
        return {
          questionId,
          shortAnswer: answer as string,
        };
      }
    });

    console.log("Answers:", answers);
    const response = await submitAnswers(t, submissionId, answers);

    console.log("Response:", response);

    if (!response) {
      return Response.json({
        success: false,
        message: "Failed to submit answers",
      });
    }

    return redirect(`/tryout/view/${tryoutId}`);
  } catch (error) {
    console.error("Error submit answers:", error);
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

export async function loader(args: LoaderFunctionArgs) {
  const cookieHeader = args.request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }
  const idParam = args.params.id;

  if (!idParam) {
    return redirect("/");
  }

  const tryout = await getTryout(t, idParam);

  if (!tryout) {
    return redirect("/");
  }

  const submission = await getSubmission(t, tryout.id, user.id);

  if (!submission || !submission.id || submission.submittedAt) {
    return redirect(`/tryout/view/${tryout.id}`);
  }

  return {
    tryout,
    submission,
    t,
  };
}

export default function Index() {
  const data = useLoaderData<{
    tryout: Tryout;
    submission: Submission;
  }>();
  const { tryout } = data;
  const { submission } = data;

  const actionData = useActionData<{ success: boolean; message: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (actionData) {
      if (!actionData.success) {
        toast("Error", {
          description: actionData.message,
        });
      }
    }
  }, [actionData]);

  const questions = tryout?.questions || [];
  const currentQuestion = questions[currentQuestionIndex] || {
    text: "",
    id: "",
    choices: [],
    questionType: "",
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < tryout.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < tryout.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleChoiceSelection = async (choiceId: string) => {
    const prefixedId = `choice_${choiceId}`;

    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: prefixedId,
    });
  };

  const handleShortAnswerInput = (value: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: value,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("submissionId", submission.id);
    formData.append("tryoutId", tryout.id);
    formData.append("answers", JSON.stringify(userAnswers));

    submit(formData, {
      method: "post",
      action: `/tryout/attempt/${tryout.id}`,
    });

    setSuccessModalOpen(false);
  };

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-6 xl:grid-cols-5 gap-3 h-fit min-h-screen py-10 mx-10 lg:mx-20">
      <Card className="lg:col-span-2 xl:col-span-1 w-full h-fit">
        <CardTitle className="p-6">Questions</CardTitle>
        <CardContent className="grid grid-cols-4 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-4 gap-2 space-y-0 mb-0">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant={index === currentQuestionIndex ? "default" : "outline"}
              onClick={() => navigateToQuestion(index)}
              className={userAnswers[question.id] ? "border-green-500" : ""}
            >
              {index + 1}
            </Button>
          ))}
        </CardContent>
        <CardDescription className="flex flex-row justify-between p-6 space-y-0">
          <Button
            variant="default"
            onClick={() => setSuccessModalOpen(true)}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </CardDescription>
      </Card>

      <Card className="lg:col-span-4 h-fit">
        <CardTitle className="p-6">
          Question {currentQuestionIndex + 1}
        </CardTitle>
        <CardDescription className="p-6 space-y-4">
          <p>{currentQuestion.text}</p>

          {currentQuestion.type === "ShortAnswer" ? (
            <Input
              placeholder="Your answer"
              value={userAnswers[currentQuestion.id] || ""}
              onChange={(e) => handleShortAnswerInput(e.target.value)}
              className="mt-4"
              disabled={isSubmitting}
            />
          ) : (
            <RadioGroup
              value={userAnswers[currentQuestion.id]?.replace("choice_", "")}
              onValueChange={(value) => handleChoiceSelection(value)}
              className="mt-4 space-y-3"
            >
              {(currentQuestion.choices || []).map((choice) => (
                <div key={choice.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={choice.id} id={choice.id} />
                  <Label htmlFor={choice.id} className="font-medium text-sm">
                    {choice.choiceText}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="flex flex-row justify-between pt-3 mt-6">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="default"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </CardDescription>
      </Card>

      <Modal open={successModalOpen}>
        <ModalCenter closeButton={false} className="max-md:min-w-[70vw]">
          <ModalContent className="text-center space-y-5 flex flex-col items-center">
            <h1 className="text-3xl text-center text-cyan-950 font-semibold">
              Are you sure?
            </h1>
            <p className="text-gray-600">
              You have answered {Object.keys(userAnswers).length} out of{" "}
              {tryout.questions.length} questions.
            </p>
            <div className="flex flex-row gap-4 justify-between w-full">
              <Button
                className="w-full bg-slate-600 hover:bg-slate-500"
                onClick={() => {
                  setSuccessModalOpen(false);
                }}
                variant={"default"}
                disabled={isSubmitting}
              >
                Go back
              </Button>
              <Button
                className="w-full"
                onClick={handleSubmit}
                variant={"default"}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </ModalContent>
        </ModalCenter>
      </Modal>
    </div>
  );
}
