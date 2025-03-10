import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { token } from "~/auth/token";
import { submitAnswers } from "~/hooks/submissions";

export async function TryoutAttemptAction({ request }: ActionFunctionArgs) {
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

    const response = await submitAnswers(t, submissionId, answers);

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
