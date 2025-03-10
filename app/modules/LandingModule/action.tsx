import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { token } from "~/auth/token";
import { deleteTryout } from "~/hooks/tryouts";

export async function LandingAction({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const formData = await request.formData();
  const tryoutId = formData.get("tryoutId") as string;

  try {
    const response = await deleteTryout(t, tryoutId);

    if (!response) {
      return redirect("/");
    }

    return redirect("/");
  } catch (error) {
    console.error("Error deleting tryout:", error);
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
