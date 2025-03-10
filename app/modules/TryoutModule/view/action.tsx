import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { token } from "~/auth/token";

export async function TryoutViewAction({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const tryoutId = formData.get("tryoutId") as string;

  try {
    const API_URL = process.env.SERVER_URL;

    const response = await fetch(`${API_URL}api/submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({
        userId,
        tryoutId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create submission:", response.status);
      return null;
    }

    const data = await response.json();

    return redirect(`/tryout/attempt/${tryoutId}`);
  } catch (error) {
    console.error("Error creating submission:", error);
    return null;
  }
}
