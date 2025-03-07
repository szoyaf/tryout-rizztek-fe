import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <Card>
        <CardTitle>Login</CardTitle>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Email</Label>
            <Input placeholder="Enter your Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>Password</Label>
            <Input placeholder="Enter your Password" />
          </div>

          <Button className="mt-4 w-full" variant="default">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
