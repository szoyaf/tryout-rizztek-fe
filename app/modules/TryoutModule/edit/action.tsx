import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { token } from "~/auth/token";
import { updateTryout } from "~/hooks/tryouts";

export async function TryoutEditAction({
  request,
  params,
}: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);
  const tryoutId = params.id;

  if (!tryoutId) {
    return Response.json({ success: false, message: "Invalid tryout ID" });
  }

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  const openDateStr = formData.get("openDate") as string;
  const openHour = formData.get("openHour") as string;
  const openMinute = formData.get("openMinute") as string;
  const closeDateStr = formData.get("closeDate") as string;
  const closeHour = formData.get("closeHour") as string;
  const closeMinute = formData.get("closeMinute") as string;

  const openDateObj = new Date(openDateStr);
  openDateObj.setHours(parseInt(openHour), parseInt(openMinute));
  const startAt = openDateObj.toISOString();

  const closeDateObj = new Date(closeDateStr);
  closeDateObj.setHours(parseInt(closeHour), parseInt(closeMinute));
  const endAt = closeDateObj.toISOString();

  const duration = parseInt(formData.get("duration") as string, 10);
  const questions = JSON.parse(formData.get("questions") as string);

  try {
    const response = await updateTryout(
      t,
      tryoutId,
      title,
      description,
      category,
      startAt,
      endAt,
      duration,
      questions
    );

    if (!response) {
      return Response.json({
        success: false,
        message: "Failed to update tryout",
      });
    }

    return redirect("/");
  } catch (error) {
    console.error("Error updating tryout:", error);
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
