import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";

export async function TryoutFormLoader({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }

  return {
    userId: user.id,
    t,
  };
}
