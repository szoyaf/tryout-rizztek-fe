import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { getUserData } from "~/auth/getUserData";
import { Tryout, Submission, Question } from "~/auth/interface";
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
import { getSubmission } from "~/hooks/submissions";
import { getTryout } from "~/hooks/tryouts";

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

  console.log(tryout);

  return {
    tryout,
    submission,
  };
}

export default function Index() {
  const data = useLoaderData<{ tryout: Tryout; submission: Submission }>();
  const { tryout } = data;
  const { submission } = data;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

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

  const handleChoiceSelection = (choiceId: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: choiceId,
    });
  };

  const handleShortAnswerInput = (value: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: value,
    });
  };

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-6 xl:grid-cols-5 gap-3 h-fit min-h-screen py-10 mx-10 lg:mx-20">
      <Card className="lg:col-span-2 xl:col-span-1 w-full h-fit">
        <CardTitle className="p-6">Questions</CardTitle>
        <CardContent className="grid grid-cols-4 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-4 gap-2 space-y-0 mb-0">
          {/* Add a guard for questions array */}
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
          <Button variant="default" onClick={() => setSuccessModalOpen(true)}>
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
            />
          ) : (
            <RadioGroup
              value={userAnswers[currentQuestion.id]}
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
              >
                Go back
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  navigate(`/tryout/view/${tryout.id}`);
                }}
                variant={"default"}
              >
                Submit
              </Button>
            </div>
          </ModalContent>
        </ModalCenter>
      </Modal>
    </div>
  );
}
