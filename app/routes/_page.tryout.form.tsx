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
import { CalendarIcon, PlusCircleIcon, TrashIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";

interface Question {
  text: string;
  type: string;
  choices: string[];
}

export default function Index() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "Multiple Choice",
      choices: [""],
    },
  ]);
  const [openDate, setOpenDate] = useState<Date | undefined>(undefined);
  const [closeDate, setCloseDate] = useState<Date | undefined>(undefined);

  const handleQuestionTextChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index: number, type: string) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;

    if (
      type === "Multiple Choice" &&
      newQuestions[index].choices.length === 0
    ) {
      newQuestions[index].choices = [""];
    }
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(newQuestions);
  };

  const addChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push("");
    setQuestions(newQuestions);
  };

  const removeChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices = newQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "Multiple Choice",
        choices: [""],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 justify-start items-center w-full h-fit py-10">
      <h1 className="text-4xl font-bold">Post a Tryout</h1>
      <Card className="w-[80%]">
        <CardContent className="flex flex-col items-start justify-center mt-6">
          <Label>Title</Label>
          <Input placeholder="Enter a title" className="w-full" />
          <Label>Description</Label>
          <Input placeholder="Enter a description" className="w-full" />
          <Label>Category</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="math">Math</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-row gap-5 justify-center items-center w-fit">
            <Label className="min-w-fit">Opens at</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-fit">
                  {openDate ? format(openDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={openDate}
                  onSelect={setOpenDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select>
              <SelectTrigger className="w-full">
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
            <Select>
              <SelectTrigger className="w-full">
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
          <div className="flex flex-row gap-5 justify-center items-center w-fit">
            <Label className="min-w-fit">Closes at</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-fit">
                  {closeDate ? format(closeDate, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={closeDate}
                  onSelect={setCloseDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select>
              <SelectTrigger className="w-full">
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
            <Select>
              <SelectTrigger className="w-full">
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
        </CardContent>

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
              />
              <div className="flex gap-2">
                <Select
                  value={question.type}
                  onValueChange={(value) =>
                    handleQuestionTypeChange(questionIndex, value)
                  }
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
                  disabled={questions.length === 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {question.type === "Multiple Choice" && (
              <div className="flex flex-col gap-2 w-full mt-4">
                {question.choices.map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="flex items-center gap-2">
                    <Input
                      placeholder="Enter a choice"
                      value={choice}
                      onChange={(e) =>
                        handleChoiceChange(
                          questionIndex,
                          choiceIndex,
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                    <Button
                      variant="outline"
                      onClick={() => removeChoice(questionIndex, choiceIndex)}
                      disabled={question.choices.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => addChoice(questionIndex)}
                  className="flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Choice
                </Button>
              </div>
            )}
          </CardContent>
        ))}

        <CardDescription className="pt-0">
          <Button
            variant="outline"
            onClick={addQuestion}
            className="flex items-center gap-2 w-full"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Add Question
          </Button>
          <Button className="text-white w-full" variant={"default"}>
            Publish Tryout
          </Button>
        </CardDescription>
      </Card>
    </div>
  );
}
