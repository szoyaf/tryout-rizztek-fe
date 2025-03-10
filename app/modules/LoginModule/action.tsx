import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { token } from "~/auth/token";
import { loginSchema } from "./zod";
import { z } from "zod";

export async function LoginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const validatedData = loginSchema.parse({
      email,
      password,
    });

    const response = await fetch(`${process.env.SERVER_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return Response.json({
        errors: {
          form: data.message || "Invalid email or password",
        },
        success: false,
      });
    }

    return redirect("/", {
      headers: {
        "Set-Cookie": await token.serialize(data.token),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const field = curr.path[0] as string;
        acc[field] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      console.log(formattedErrors);

      return Response.json({
        errors: formattedErrors,
        success: false,
      });
    }

    return Response.json({
      errors: {
        form:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      success: false,
    });
  }
}
