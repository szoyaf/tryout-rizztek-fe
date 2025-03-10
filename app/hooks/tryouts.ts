import {
  Answer,
  Choice,
  GetTryoutResponse,
  GetTryoutsResponse,
  Question,
  Tryout,
} from "~/auth/interface";

export const getTryout = async (token: string, id: string) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(`${API_URL}api/tryout/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  } else {
    const data: GetTryoutResponse = await response.json();
    const tryout = data.tryout;

    if (!tryout) {
      return null;
    }

    return {
      id: tryout.id,
      title: tryout.title,
      description: tryout.description,
      userId: tryout.userId,
      category: tryout.category as
        | "Programming"
        | "Math"
        | "Science"
        | "History"
        | "English"
        | "Geography"
        | "Art"
        | "Music"
        | "Sports",
      startAt: tryout.startAt.split(" ").slice(0, 3).join(" "),
      endAt: tryout.endAt.split(" ").slice(0, 3).join(" "),
      duration: tryout.duration,
      createdAt: tryout.createdAt.split(" ").slice(0, 3).join(" "),
      updatedAt: tryout.updatedAt.split(" ").slice(0, 3).join(" "),
      questions: tryout.questions?.map((question) => ({
        id: question.id,
        tryoutId: question.tryoutId,
        text: question.text,
        score: question.score,
        type: question.type,
        correctShortAnswer: question.correctShortAnswer,
        choices: question.choices?.map((choice) => ({
          id: choice.id,
          questionId: choice.questionId,
          choiceText: choice.choiceText,
          isAnswer: choice.isAnswer,
          answers: choice.answers?.map((answer) => ({
            id: answer.id,
            submissionId: answer.submissionId,
            questionId: answer.questionId,
            answerText: answer.answerText,
            choiceId: answer.choiceId,
            shortAnswer: answer.shortAnswer,
            isCorrect: answer.isCorrect,
          })) as Answer[],
        })) as Choice[],
      })) as Question[],
    } as Tryout;
  }
};

export const getTryouts = async (token: string) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(`${API_URL}api/tryout`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  } else {
    const data: GetTryoutsResponse = await response.json();
    const tryouts = data.tryouts;

    if (!tryouts) {
      return null;
    }

    return tryouts.map((tryout) => ({
      id: tryout.id,
      title: tryout.title,
      description: tryout.description,
      userId: tryout.userId,
      category: tryout.category as
        | "Programming"
        | "Math"
        | "Science"
        | "History"
        | "English"
        | "Geography"
        | "Art"
        | "Music"
        | "Sports",
      startAt: tryout.startAt.split(" ").slice(0, 3).join(" "),
      endAt: tryout.endAt.split(" ").slice(0, 3).join(" "),
      duration: tryout.duration,
      createdAt: tryout.createdAt.split(" ").slice(0, 3).join(" "),
      updatedAt: tryout.updatedAt.split(" ").slice(0, 3).join(" "),
    })) as Tryout[];
  }
};

export const createTryout = async (
  token: string,
  title: string,
  description: string,
  userId: string,
  category: string,
  startAt: string,
  endAt: string,
  duration: number,
  questions: {
    text: string;
    score: number;
    type: string;
    shortAnswer?: string;
    choices?: {
      choiceText: string;
      isAnswer: boolean;
    }[];
  }[]
) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(`${API_URL}api/tryout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      userId,
      description,
      category,
      startAt,
      endAt,
      duration,
      questions,
    }),
  });

  if (!response.ok) {
    console.log("Failed to create tryout:", response);
    return null;
  } else {
    const data: GetTryoutResponse = await response.json();
    const tryout = data.tryout;

    if (!tryout) {
      return null;
    }

    return tryout.id;
  }
};

export const updateTryout = async (
  token: string,
  tryoutId: string,
  title: string,
  description: string,
  category: string,
  startAt: string,
  endAt: string,
  duration: number,
  questions: {
    text: string;
    score: number;
    type: string;
    shortAnswer?: string;
    choices?: {
      choiceText: string;
      isAnswer: boolean;
    }[];
  }[]
) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(`${API_URL}api/tryout/${tryoutId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      description,
      category,
      startAt,
      endAt,
      duration,
      questions,
    }),
  });

  if (!response.ok) {
    console.log("Failed to create tryout:", response);
    return null;
  } else {
    const data: GetTryoutResponse = await response.json();
    const tryout = data.tryout;

    if (!tryout) {
      return null;
    }

    return tryout.id;
  }
};

export const deleteTryout = async (token: string, id: string) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(`${API_URL}api/tryout/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  } else {
    const data: GetTryoutResponse = await response.json();
    const tryout = data.tryout;

    if (!tryout) {
      return null;
    }

    return {
      id: tryout.id,
    } as Tryout;
  }
};
