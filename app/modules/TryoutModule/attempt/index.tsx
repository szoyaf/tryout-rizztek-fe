import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Submission, Tryout } from "~/auth/interface";
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

export default function TryoutAttemptModule() {
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

  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const createdAt = new Date(submission.createdAt).getTime();
    const duration = tryout.duration * 60 * 1000;
    const endAt = new Date(tryout.endAt).getTime();
    const expiryTime = Math.min(createdAt + duration, endAt);
    const remaining = Math.max(0, expiryTime - Date.now());

    setTimeRemaining(remaining);

    if (remaining <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      const newRemaining = Math.max(0, expiryTime - Date.now());
      setTimeRemaining(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(timer);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [submission.createdAt, tryout.duration]);

  const handleAutoSubmit = () => {
    toast("Time's Up!", {
      description: "Your answers are being submitted automatically.",
    });

    const formData = new FormData();
    formData.append("submissionId", submission.id);
    formData.append("tryoutId", tryout.id);
    formData.append("answers", JSON.stringify(userAnswers));
    formData.append("isAutoSubmit", "true");

    submit(formData, {
      method: "post",
      action: `/tryout/attempt/${tryout.id}`,
    });
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
        <CardDescription className="flex flex-col justify-center p-6 pt-3 space-y-0">
          <div
            className={`text-center font-bold text-sm mb-2 ${
              timeRemaining < 60000 ? "text-red-500" : ""
            }`}
          >
            Time Remaining: {formatTimeRemaining()}
          </div>
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
