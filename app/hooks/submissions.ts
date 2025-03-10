import {
  Answer,
  ApiResponse,
  GetSubmissionResponse,
  Submission,
} from "~/auth/interface";

export const getSubmission = async (
  token: string,
  tryoutId: string,
  userId: string
) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(
    `${API_URL}api/submission/tryout/user/${tryoutId}/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  } else {
    const data: GetSubmissionResponse = await response.json();
    const submission = data.submission;

    if (!submission) {
      return null;
    }

    return {
      id: submission.id,
      tryoutId: submission.tryoutId,
      userId: submission.userId,
      score: submission.score,
      submittedAt: submission.submittedAt
        ? submission.submittedAt.split(" ").slice(0, 3).join(" ")
        : null,
      createdAt: submission.createdAt.split(" ").slice(0, 3).join(" "),
      answers: submission.answers?.map((answer) => ({
        id: answer.id,
        submissionId: answer.submissionId,
        questionId: answer.questionId,
        answerText: answer.answerText,
        choiceId: answer.choiceId,
        shortAnswer: answer.shortAnswer,
        isCorrect: answer.isCorrect,
      })) as Answer[],
    } as Submission;
  }
};

export const submitAnswers = async (
  token: string,
  id: string,
  answers: {
    questionId: string;
    choiceId?: string;
    shortAnswer?: string;
  }[]
) => {
  const API_URL = process.env.SERVER_URL;

  const response = await fetch(`${API_URL}api/submission/${id}/submit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      answers,
    }),
  });

  if (!response.ok) {
    console.log("Failed to submit answers:", response);
    return null;
  } else {
    const data: GetSubmissionResponse = await response.json();
    const submission = data.submission;

    if (!submission) {
      return null;
    }

    return submission.id;
  }
};
