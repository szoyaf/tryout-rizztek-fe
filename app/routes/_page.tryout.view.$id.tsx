import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { Submission, Tryout, User } from "~/auth/interface";
import { token } from "~/auth/token";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription } from "~/components/ui/card";
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

  return {
    tryout,
    submission,
  };
}

export default function Index() {
  const data = useLoaderData<{ tryout: Tryout; submission: Submission }>();
  const { tryout } = data;
  const { submission } = data;

  return (
    <div className="flex flex-col gap-3 justify-start items-center w-full h-fit py-10">
      <h1 className="text-4xl font-bold">{tryout.title}</h1>
      <Card className="w-[80%]">
        <CardDescription className="space-y-1 pt-6">
          <p>{tryout.description}</p>
        </CardDescription>
        <CardContent className="flex flex-col items-center justify-center  mt-6">
          <p>Time limit: {tryout.duration} mins</p>
          <div className="space-y-1 text-sm">
            <p>
              Opened:{" "}
              {new Date(tryout.startAt).toLocaleString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <p>
              Closed:{" "}
              {new Date(tryout.endAt).toLocaleString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </div>
          <Link to={`/tryout/attempt/${tryout.id}`}>
            <Button
              variant="default"
              disabled={new Date() > new Date(tryout.endAt)}
            >
              Attempt
            </Button>
          </Link>
        </CardContent>

        <CardContent className="flex flex-col items-center justify-center  mt-6">
          {submission && submission.submittedAt && (
            <>
              <p>Summary</p>
              <div className="space-y-1 text-sm bg-cyan-100 border-2 border-cyan-950 rounded-lg w-[80%]">
                <div className="grid grid-cols-4 text-sm p-4 border-b-2 border-b-cyan-950">
                  <p className="col-span-3">State</p>
                  <p>{submission.score}/100.00</p>
                </div>

                <div className="grid grid-cols-4 text-sm p-4">
                  <div className="col-span-3">
                    <p>{submission.submittedAt ? "Finished" : "Ongoing"}</p>
                    {submission.submittedAt && (
                      <p>
                        Submitted{" "}
                        {new Date(submission.submittedAt).toLocaleString(
                          "en-GB",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          }
                        )}
                      </p>
                    )}
                  </div>
                  <p>86.00</p>
                </div>
              </div>
            </>
          )}
          <Link to="/">
            <Button variant="default">Back to course</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
