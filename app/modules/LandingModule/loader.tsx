import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { getTryouts } from "~/hooks/tryouts";

export async function LandingLoader(args: LoaderFunctionArgs) {
  const cookieHeader = args.request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }

  const tryouts = await getTryouts(t);

  return {
    user,
    tryouts,
    t,
  };
}
