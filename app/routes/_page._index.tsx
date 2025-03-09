import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";

export async function loader(args: LoaderFunctionArgs) {
  const cookieHeader = args.request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const user = await getUserData(t);

  if (!user) {
    return redirect('/login');
  }

  return {
    ...user,
    t
  };
}

export default function Index() {
  return (
    <div className="flex flex-col gap-2 justify-start items-center w-full min-h-screen py-10">
      <h1 className="text-4xl font-bold">Tryouts!</h1>
      <Link to="/tryout/form">
        <Button variant="default">Create Tryout</Button>
      </Link>
      <Card className="w-[80%]">
        <CardTitle className="flex flex-row justify-between">
          Tryout 1<Button variant="default">Take the test</Button>
        </CardTitle>
        <CardDescription className="space-y-1">
          <p>Opened: time open</p>
          <p>Closed: time close</p>
        </CardDescription>
      </Card>
      <Card className="w-[80%]">
        <CardTitle className="flex flex-row justify-between">
          Tryout 2<Button variant="default">Take the test</Button>
        </CardTitle>
        <CardDescription className="space-y-1">
          <p>Opened: time open</p>
          <p>Closed: time close</p>
        </CardDescription>
      </Card>
      <Card className="w-[80%]">
        <CardTitle className="flex flex-row justify-between">
          Tryout 3<Button variant="default">Take the test</Button>
        </CardTitle>
        <CardDescription className="space-y-1">
          <p>Opened: time open</p>
          <p>Closed: time close</p>
          <div className="flex flex-row justify-start gap-4">
            <Button variant="default">Edit</Button>
            <Button variant="default" className="bg-red-900 hover:bg-red-800">
              Delete
            </Button>
          </div>
        </CardDescription>
      </Card>
      <Card className="w-[80%]">
        <CardTitle className="flex flex-row justify-between">
          Tryout 2<Button variant="default">Take the test</Button>
        </CardTitle>
        <CardDescription className="space-y-1">
          <p>Opened: time open</p>
          <p>Closed: time close</p>
        </CardDescription>
      </Card>
    </div>
  );
}
