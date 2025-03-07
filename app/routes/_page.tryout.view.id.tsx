import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
} from "~/components/ui/card";

export default function Index() {
  return (
    <div className="flex flex-col gap-3 justify-start items-center w-full h-fit py-10">
      <h1 className="text-4xl font-bold">Tryout 1</h1>
      <Card className="w-[80%]">
        <CardDescription className="space-y-1 pt-6">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            id nunc ante. Suspendisse nisi justo, auctor sed tellus quis,
            blandit tincidunt felis. Donec commodo nulla commodo, venenatis nisi
            ac, porttitor eros. Pellentesque pellentesque neque vitae massa
            placerat, in congue justo iaculis. Donec malesuada blandit finibus.
            Curabitur tempor aliquam nisi. Fusce nec enim erat. Sed vel tortor a
            lorem semper pharetra. Curabitur a libero tempor, dignissim massa
            et, tincidunt purus. Maecenas et consectetur elit. Duis lacinia
            lectus at ante porttitor pulvinar.
          </p>
        </CardDescription>
        <CardContent className="flex flex-col items-center justify-center  mt-6">
          <p>Time limit: 50 mins</p>
          <div className="space-y-1 text-sm">
            <p>Opened: time open</p>
            <p>Closed: time close</p>
          </div>
          <Link to="/tryout/attempt/id">
            <Button variant="default">Attempt</Button>
          </Link>
        </CardContent>

        <CardContent className="flex flex-col items-center justify-center  mt-6">
          <p>Summary</p>
          <div className="space-y-1 text-sm bg-cyan-100 border-2 border-cyan-950 rounded-lg w-[80%]">
            <div className="grid grid-cols-4 text-sm p-4 border-b-2 border-b-cyan-950">
              <p className="col-span-3">State</p>
              <p>Grade/100.00</p>
            </div>

            <div className="grid grid-cols-4 text-sm p-4">
              <div className="col-span-3">
                <p>Finished</p>
                <p>Submitted Tuesday, 3 December 2024, 5:50 PM</p>
              </div>
              <p>86.00</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="default">Back to course</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
