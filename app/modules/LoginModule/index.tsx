import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function LoginModule() {
  const actionData = useActionData<{
    errors?: { email?: string; password?: string; form?: string };
  }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <Card>
        <CardTitle>Login</CardTitle>
        <CardContent>
          <Form method="post">
            <div className="grid w-full items-center gap-1.5 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email"
                aria-invalid={Boolean(actionData?.errors?.email)}
              />
              {actionData?.errors?.email && (
                <p className="text-sm text-red-500">
                  {actionData.errors.email}
                </p>
              )}
            </div>

            <div className="grid w-full items-center gap-1.5 mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your Password"
                aria-invalid={Boolean(actionData?.errors?.password)}
              />
              {actionData?.errors?.password && (
                <p className="text-sm text-red-500">
                  {actionData.errors.password}
                </p>
              )}
            </div>

            {actionData?.errors?.form && (
              <div className="p-1 bg-red-100 border text-sm text-center border-red-400 text-red-700 mb-4 rounded">
                {actionData.errors.form}
              </div>
            )}

            <Button
              className="mt-4 w-full"
              variant="default"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm mt-4 text-center">Don't have an account?</p>
            <Link to="/register" className="block w-full">
              <Button className="mt-1 w-full" variant="ghost">
                Sign up
              </Button>
            </Link>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
