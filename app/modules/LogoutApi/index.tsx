import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { token } from "~/auth/token";

export async function LogoutApiAction({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  if (t) {
    try {
      await fetch(`${process.env.API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${t}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error calling logout API:", error);
    }
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await token.serialize("", {
        maxAge: 0,
        path: "/",
        expires: new Date(0),
      }),
    },
  });
}
