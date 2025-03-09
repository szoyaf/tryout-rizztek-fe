import { ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { registerSchema } from "./zod";
import { z } from "zod";

export async function RegisterAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const validatedData = registerSchema.parse({
      username,
      email,
      password,
    });

    const response = await fetch(`${process.env.SERVER_URL}register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return Response.json({
        errors: {
          form: "The server returned an invalid response. Please try again later.",
        },
        success: false,
      });
    }

    if (!response.ok) {
      return Response.json({
        errors: {
          form: data.message || data.error || "Registration failed",
        },
        success: false,
      });
    }

    return redirect("/login");
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const field = curr.path[0] as string;
        acc[field] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      return Response.json({
        errors: formattedErrors,
        success: false,
      });
    }

    console.error("Registration error:", error);
    return Response.json({
      errors: {
        form:
          error instanceof Error
            ? error.message
            : "Failed to connect to the server. Please try again.",
      },
      success: false,
    });
  }
}
