import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { getSubmission } from "~/hooks/submissions";
import { getTryout } from "~/hooks/tryouts";

export async function TryoutViewLoader(args: LoaderFunctionArgs) {
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

  let totalScore = 0;

  for (const question of tryout.questions) {
    totalScore += question.score;
  }

  return {
    user,
    tryout,
    submission,
    totalScore,
  };
}
