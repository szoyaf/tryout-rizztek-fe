import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  AlertCircle,
  CalendarIcon,
  PlusCircleIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { token } from "~/auth/token";
import { getTryout, updateTryout } from "~/hooks/tryouts";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { getUserData } from "~/auth/getUserData";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }

  const tryoutId = params.id;
  if (!tryoutId) {
    return redirect("/");
  }

  try {
    const tryout = await getTryout(t, tryoutId);

    if (!tryout) {
      return redirect("/");
    }

    if (tryout.userId !== user.id) {
      return redirect("/");
    }

    return {
      userId: user.id,
      t,
      tryout,
    };
  } catch (error) {
    console.error("Error fetching tryout:", error);
    return redirect("/");
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const tryoutId = params.id;

  if (!tryoutId) {
    return Response.json({ success: false, message: "Invalid tryout ID" });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  const openDateStr = formData.get("openDate") as string;
  const openHour = formData.get("openHour") as string;
  const openMinute = formData.get("openMinute") as string;
  const closeDateStr = formData.get("closeDate") as string;
  const closeHour = formData.get("closeHour") as string;
  const closeMinute = formData.get("closeMinute") as string;

  const openDateObj = new Date(openDateStr);
  openDateObj.setHours(parseInt(openHour), parseInt(openMinute));
  const startAt = openDateObj.toISOString();

  const closeDateObj = new Date(closeDateStr);
  closeDateObj.setHours(parseInt(closeHour), parseInt(closeMinute));
  const endAt = closeDateObj.toISOString();

  const duration = parseInt(formData.get("duration") as string, 10);
  const questions = JSON.parse(formData.get("questions") as string);

  try {
    const response = await updateTryout(
      t,
      tryoutId,
      title,
      description,
      category,
      startAt,
      endAt,
      duration,
      questions
    );

    if (!response) {
      return Response.json({
        success: false,
        message: "Failed to update tryout",
      });
    }

    return redirect("/");
  } catch (error) {
    console.error("Error updating tryout:", error);
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}

interface Question {
  text: string;
  score: number;
  type: string;
  correctShortAnswer?: string;
  choices?: {
    choiceText: string;
    isAnswer: boolean;
  }[];
}

export default function UpdateTryout() {
  const loaderData = useLoaderData<{
    userId: string;
    t: string;
    tryout: any;
  }>();
  const { userId, t, tryout } = loaderData;

  const actionData = useActionData<{ success: boolean; message: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [openDate, setOpenDate] = useState<Date | undefined>(undefined);
  const [openHour, setOpenHour] = useState<string>("12");
  const [openMinute, setOpenMinute] = useState<string>("00");
  const [closeDate, setCloseDate] = useState<Date | undefined>(undefined);
  const [closeHour, setCloseHour] = useState<string>("12");
  const [closeMinute, setCloseMinute] = useState<string>("00");
  const [duration, setDuration] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "Multiple Choice",
      choices: [{ choiceText: "", isAnswer: false }],
      score: 0,
    },
  ]);

  const mapBackendTypeToFrontend = (backendType: string): string => {
    switch (backendType) {
      case "MultipleChoice":
        return "Multiple Choice";
      case "TrueFalse":
        return "True/False";
      case "ShortAnswer":
        return "Short Answer";
      default:
        return backendType;
    }
  };

  useEffect(() => {
    if (tryout) {
      setTitle(tryout.title);
      setDescription(tryout.description);
      setCategory(tryout.category);

      const startDate = new Date(tryout.startAt);
      setOpenDate(startDate);
      setOpenHour(startDate.getHours().toString().padStart(2, "0"));
      setOpenMinute(startDate.getMinutes().toString().padStart(2, "0"));

      const endDate = new Date(tryout.endAt);
      setCloseDate(endDate);
      setCloseHour(endDate.getHours().toString().padStart(2, "0"));
      setCloseMinute(endDate.getMinutes().toString().padStart(2, "0"));

      setDuration(tryout.duration);

      if (tryout.questions && tryout.questions.length > 0) {
        const formattedQuestions = tryout.questions.map((q: any) => ({
          text: q.text,
          score: q.score,
          type: mapBackendTypeToFrontend(q.type),
          correctShortAnswer: q.correctShortAnswer || "",
          choices:
            q.choices?.map((c: any) => ({
              choiceText: c.choiceText,
              isAnswer: c.isAnswer,
            })) || [],
        }));
        setQuestions(formattedQuestions);
      }
    }
  }, [tryout]);

  const handleQuestionTextChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index: number, type: string) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;

    if (type === "Multiple Choice") {
      newQuestions[index].choices = newQuestions[index].choices?.length
        ? newQuestions[index].choices
        : [{ choiceText: "", isAnswer: false }];
      newQuestions[index].correctShortAnswer = undefined;
    } else if (type === "True/False") {
      newQuestions[index].choices = [
        { choiceText: "True", isAnswer: false },
        { choiceText: "False", isAnswer: false },
      ];
      newQuestions[index].correctShortAnswer = undefined;
    } else if (type === "Short Answer") {
      newQuestions[index].choices = [];
      newQuestions[index].correctShortAnswer = "";
    }

    setQuestions(newQuestions);
  };

  const handleScoreChange = (index: number, score: number) => {
    const newQuestions = [...questions];
    newQuestions[index].score = score;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices[choiceIndex].choiceText = value;
    }
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    choiceIndex: number
  ) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices.forEach((choice, index) => {
        choice.isAnswer = index === choiceIndex;
      });
    }
    setQuestions(newQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices.push({
        choiceText: "",
        isAnswer: false,
      });
    }
    setQuestions(newQuestions);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices = newQuestions[
        questionIndex
      ].choices.filter((_, i) => i !== choiceIndex);
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "Multiple Choice",
        choices: [{ choiceText: "", isAnswer: false }],
        score: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    openDate: "",
    closeDate: "",
    questions: [] as string[],
    duration: "",
  });

  const mapQuestionType = (frontendType: string): string => {
    switch (frontendType) {
      case "Multiple Choice":
        return "MultipleChoice";
      case "True/False":
        return "TrueFalse";
      case "Short Answer":
        return "ShortAnswer";
      default:
        return frontendType;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: "",
      description: "",
      category: "",
      openDate: "",
      closeDate: "",
      questions: [] as string[],
      duration: "",
    };

    let isValid = true;

    if (!title) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!openDate) {
      newErrors.openDate = "Open date is required";
      isValid = false;
    }

    if (!closeDate) {
      newErrors.closeDate = "Close date is required";
      isValid = false;
    }

    if (!duration) {
      newErrors.duration = "Duration is required";
      isValid = false;
    }

    newErrors.questions = questions.map(() => "");

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text) {
        newErrors.questions[i] = "Question text is required";
        isValid = false;
      } else if (questions[i].score <= 0) {
        newErrors.questions[i] = "Score must be greater than 0";
        isValid = false;
      } else if (
        (questions[i].type === "Multiple Choice" ||
          questions[i].type === "True/False") &&
        !questions[i].choices?.some((c) => c.isAnswer)
      ) {
        newErrors.questions[i] = "Please select a correct answer";
        isValid = false;
      } else if (
        questions[i].type === "Multiple Choice" &&
        questions[i].choices?.some((c) => !c.choiceText)
      ) {
        newErrors.questions[i] = "Please fill in all choices";
        isValid = false;
      } else if (
        questions[i].type === "Short Answer" &&
        !questions[i].correctShortAnswer
      ) {
        newErrors.questions[i] = "Expected answer is required";
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      const formattedQuestions = questions.map((q) => ({
        ...q,
        type: mapQuestionType(q.type),
      }));

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      if (openDate) {
        formData.append("openDate", openDate.toISOString());
      }
      formData.append("openHour", openHour);
      formData.append("openMinute", openMinute);
      if (closeDate) {
        formData.append("closeDate", closeDate.toISOString());
      }
      formData.append("closeHour", closeHour);
      formData.append("closeMinute", closeMinute);
      formData.append("duration", duration.toString());
      formData.append("questions", JSON.stringify(formattedQuestions));

      submit(formData, { method: "post" });
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null;

    return (
      <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
        <AlertCircle className="h-4 w-4" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 justify-start items-center w-full h-fit py-10">
      <h1 className="text-4xl font-bold">Edit Tryout</h1>
      <Card className="w-[80%]">
        <Form method="post" onSubmit={handleSubmit}>
          <CardContent className="flex flex-col items-start justify-start mt-6 gap-4">
            <div className="w-full">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
              />
              <ErrorMessage message={errors.title} />
            </div>

            <div className="w-full">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter a description"
                className="w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
              <ErrorMessage message={errors.description} />
            </div>

            <div className="w-full">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={category}
                onValueChange={setCategory}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Math">Math</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage message={errors.category} />
            </div>

            <div className="flex flex-row gap-5 justify-start items-center w-full">
              <Label className="min-w-fit">Opens at</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-fit"
                    disabled={isSubmitting}
                  >
                    {openDate ? (
                      format(openDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={openDate}
                    onSelect={setOpenDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <input
                type="hidden"
                name="openDate"
                value={openDate?.toISOString() || ""}
              />

              <Select
                name="openHour"
                value={openHour}
                onValueChange={setOpenHour}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(24).keys()].map((hour) => (
                    <SelectItem
                      key={hour}
                      value={hour.toString().padStart(2, "0")}
                    >
                      {hour.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                name="openMinute"
                value={openMinute}
                onValueChange={setOpenMinute}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(60).keys()].map((minute) => (
                    <SelectItem
                      key={minute}
                      value={minute.toString().padStart(2, "0")}
                    >
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row gap-5 justify-start items-center w-full">
              <Label className="min-w-fit">Closes at</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-fit"
                    disabled={isSubmitting}
                  >
                    {closeDate ? (
                      format(closeDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={closeDate}
                    onSelect={setCloseDate}
                    disabled={(date) => (openDate ? date < openDate : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <input
                type="hidden"
                name="closeDate"
                value={closeDate?.toISOString() || ""}
              />

              <Select
                name="closeHour"
                value={closeHour}
                onValueChange={setCloseHour}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(24).keys()].map((hour) => (
                    <SelectItem
                      key={hour}
                      value={hour.toString().padStart(2, "0")}
                    >
                      {hour.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                name="closeMinute"
                value={closeMinute}
                onValueChange={setCloseMinute}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(60).keys()].map((minute) => (
                    <SelectItem
                      key={minute}
                      value={minute.toString().padStart(2, "0")}
                    >
                      {minute.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="Enter duration in minutes"
                className="w-full"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                disabled={isSubmitting}
              />
              <ErrorMessage message={errors.duration} />
            </div>
          </CardContent>

          <input
            type="hidden"
            name="questions"
            value={JSON.stringify(questions)}
          />

          {questions.map((question, questionIndex) => (
            <CardContent key={questionIndex}>
              <div className="flex flex-row gap-5 justify-between items-center w-full">
                <Input
                  placeholder="Untitled Question"
                  className="w-full"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionTextChange(questionIndex, e.target.value)
                  }
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      handleQuestionTypeChange(questionIndex, value)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-fit">
                      <SelectValue placeholder="Pick a Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="True/False">True/False</SelectItem>
                      <SelectItem value="Short Answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-500"
                    disabled={questions.length === 1 || isSubmitting}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {question.type === "Multiple Choice" && (
                <div className="flex flex-col gap-2 w-full mt-4">
                  {question.choices?.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={choice.isAnswer}
                        onChange={() =>
                          handleCorrectAnswerChange(questionIndex, choiceIndex)
                        }
                        disabled={isSubmitting}
                      />
                      <Input
                        placeholder="Enter a choice"
                        value={choice.choiceText}
                        onChange={(e) =>
                          handleChoiceChange(
                            questionIndex,
                            choiceIndex,
                            e.target.value
                          )
                        }
                        className="w-full"
                        disabled={isSubmitting}
                      />
                      <Button
                        variant="outline"
                        onClick={() => removeChoice(questionIndex, choiceIndex)}
                        disabled={
                          question.choices?.length === 1 || isSubmitting
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addChoice(questionIndex)}
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    Add Choice
                  </Button>
                </div>
              )}

              {question.type === "True/False" && (
                <div className="flex flex-col gap-2 w-full mt-4">
                  {["True", "False"].map((choiceText, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={
                          question.choices?.find(
                            (c) => c.choiceText === choiceText
                          )?.isAnswer || false
                        }
                        onChange={() => {
                          const newQuestions = [...questions];
                          if (newQuestions[questionIndex].choices) {
                            newQuestions[questionIndex].choices.forEach(
                              (choice) => {
                                choice.isAnswer =
                                  choice.choiceText === choiceText;
                              }
                            );
                          }
                          setQuestions(newQuestions);
                        }}
                        disabled={isSubmitting}
                      />
                      <Input
                        value={choiceText}
                        readOnly
                        className="w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                  ))}
                </div>
              )}

              {question.type === "Short Answer" && (
                <div className="flex flex-col gap-2 w-full mt-4">
                  <Label>Expected Answer</Label>
                  <Input
                    placeholder="Enter the expected answer"
                    value={question.correctShortAnswer || ""}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[questionIndex].correctShortAnswer =
                        e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="flex flex-row gap-5 justify-start items-center w-full mt-4">
                <Label>Score</Label>
                <Input
                  type="number"
                  placeholder="Score"
                  className="w-1/4"
                  value={question.score || ""}
                  onChange={(e) =>
                    handleScoreChange(
                      questionIndex,
                      parseInt(e.target.value) || 0
                    )
                  }
                  disabled={isSubmitting}
                />
              </div>
              <ErrorMessage message={errors.questions[questionIndex]} />
            </CardContent>
          ))}

          <CardDescription className="p-4 flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={addQuestion}
              className="flex items-center gap-2 w-full"
              disabled={isSubmitting}
            >
              <PlusCircleIcon className="h-5 w-5" />
              Add Question
            </Button>

            {actionData?.success === false && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {actionData.message}
              </div>
            )}

            <Button
              type="submit"
              className="text-white w-full"
              variant={"default"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Tryout"}
            </Button>
          </CardDescription>
        </Form>
      </Card>
    </div>
  );
}
