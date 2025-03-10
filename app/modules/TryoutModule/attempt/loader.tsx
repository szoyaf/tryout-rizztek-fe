import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { getSubmission } from "~/hooks/submissions";
import { getTryout } from "~/hooks/tryouts";

export async function TryoutAttemptLoader(args: LoaderFunctionArgs) {
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

  const endAt = new Date(tryout.endAt).getTime();
  const startAt = new Date(tryout.startAt).getTime();

  if (
    !submission ||
    !submission.id ||
    submission.submittedAt ||
    Date.now() > endAt ||
    Date.now() < startAt
  ) {
    return redirect(`/tryout/view/${tryout.id}`);
  }

  return {
    tryout,
    submission,
    t,
  };
}
