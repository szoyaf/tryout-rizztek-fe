import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <Card>
        <CardTitle>Register</CardTitle>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Username</Label>
            <Input placeholder="Enter a new Username" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Email</Label>
            <Input placeholder="Enter you Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Password</Label>
            <Input placeholder="Enter a new Password" />
          </div>

          <Button className="mt-4 w-full" variant="default">
            Register
          </Button>
          <p className="text-sm mt-2">Already have an account?</p>
          <Link to="/login">
            <Button className="mt-1 w-full" variant="ghost">
              Sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
