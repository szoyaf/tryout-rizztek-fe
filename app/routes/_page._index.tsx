import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { getTryouts } from "~/hooks/tryouts";
import { useLoaderData } from "@remix-run/react";
import { Tryout, User } from "~/auth/interface";

export async function loader(args: LoaderFunctionArgs) {
  const cookieHeader = args.request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }

  const tryouts = await getTryouts(t);

  console.log(tryouts);

  return {
    user,
    tryouts,
    t,
  };
}

export default function Index() {
  const data = useLoaderData<{ tryouts: Tryout[]; user: User }>();
  const { tryouts } = data;
  const { user } = data;

  return (
    <div className="flex flex-col gap-2 justify-start items-center w-full h-fit min-h-screen py-10">
      <h1 className="text-4xl font-bold">Tryouts!</h1>
      <Link to="/tryout/form">
        <Button variant="default">Create Tryout</Button>
      </Link>

      {tryouts.map((tryout, index) => (
        <Card key={index} className="w-[80%]">
          <CardTitle className="flex flex-row justify-between">
            {tryout.title}
            <Link to={`/tryout/view/${tryout.id}`}>
              <Button variant="default">Take the test</Button>
            </Link>
          </CardTitle>
          <CardDescription className="space-y-1">
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
            {tryout.userId === user.id && (
              <div className="flex flex-row justify-start gap-4">
                <Button variant="default">Edit</Button>
                <Button
                  variant="default"
                  className="bg-red-900 hover:bg-red-800"
                >
                  Delete
                </Button>
              </div>
            )}
          </CardDescription>
        </Card>
      ))}
    </div>
  );
}
