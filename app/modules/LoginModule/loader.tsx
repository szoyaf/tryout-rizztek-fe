import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";

export async function LoginLoader(args: LoaderFunctionArgs) {
  const cookieHeader = args.request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const user = await getUserData(t);

  if (user) {
    return redirect("/");
  }

  return {
    t,
  };
}
