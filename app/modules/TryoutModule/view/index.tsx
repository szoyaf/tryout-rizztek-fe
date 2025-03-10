import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Submission, Tryout, User } from "~/auth/interface";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription } from "~/components/ui/card";

export default function TryoutViewModule() {
  const data = useLoaderData<{
    user: User;
    tryout: Tryout;
    submission: Submission;
    totalScore: number;
  }>();
  const { tryout } = data;
  const { submission } = data;
  const { user } = data;
  const { totalScore } = data;
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

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
          <Form method="post">
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="tryoutId" value={tryout.id} />
            <Button
              type="submit"
              variant="default"
              disabled={
                new Date() > new Date(tryout.endAt) ||
                new Date() < new Date(tryout.startAt) ||
                isSubmitting ||
                (submission && !submission.id) ||
                (submission && !!submission.submittedAt)
              }
            >
              {submission && submission.id
                ? "Continue Attempt"
                : isSubmitting
                ? "Starting..."
                : "Attempt"}
            </Button>
          </Form>
        </CardContent>

        <CardContent className="flex flex-col items-center justify-center  mt-6">
          {submission && submission.submittedAt && (
            <>
              <p>Summary</p>
              <div className="space-y-1 text-sm bg-cyan-100 border-2 border-cyan-950 rounded-lg w-[80%]">
                <div className="grid grid-cols-4 text-sm p-4 border-b-2 border-b-cyan-950">
                  <p className="col-span-3">State</p>
                  <p>Grade/{totalScore}</p>
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
                  <p>{submission.score}</p>
                </div>
              </div>
              <p>
                Your final grade:{" "}
                {submission && submission.score != null
                  ? (submission.score / totalScore) * 100
                  : 0}
                %
              </p>
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
