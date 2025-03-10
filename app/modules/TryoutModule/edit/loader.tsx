import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserData } from "~/auth/getUserData";
import { token } from "~/auth/token";
import { getTryout } from "~/hooks/tryouts";

export async function TryoutEditLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const user = await getUserData(t);

  if (!user) {
    return redirect("/login");
  }

  const tryoutId = params.id;
  if (!tryoutId) {
    return redirect("/");
  }

  try {
    const tryout = await getTryout(t, tryoutId);

    if (!tryout) {
      return redirect("/");
    }

    if (tryout.userId !== user.id) {
      return redirect("/");
    }

    return {
      userId: user.id,
      t,
      tryout,
    };
  } catch (error) {
    console.error("Error fetching tryout:", error);
    return redirect("/");
  }
}
