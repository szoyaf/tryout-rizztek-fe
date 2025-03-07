import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Modal, ModalCenter, ModalContent } from "~/components/elements/Modals";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function Index() {
  const navigate = useNavigate();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-6 xl:grid-cols-5 gap-3 h-fit min-h-screen py-10 mx-10 lg:mx-20">
      <Card className="lg:col-span-2 xl:col-span-1 w-full h-fit">
        <CardTitle>Soal</CardTitle>
        <CardContent className="grid grid-cols-4 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-4 gap-2 space-y-0 mb-0">
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
          <Button variant="default">1</Button>
        </CardContent>
        <CardDescription className="flex flex-row justify-between pt-3 space-y-0">
          <Button variant="default" onClick={() => setSuccessModalOpen(true)}>
            Submit
          </Button>
        </CardDescription>
      </Card>
      <Card className="lg:col-span-4 h-fit">
        <CardTitle>Soal 1</CardTitle>
        <CardDescription className="space-y-1">
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
          <Input placeholder="Answer" />

          <RadioGroup>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one" className="font-medium text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse id nunc ante. Suspendisse nisi justo, auctor sed
                tellus quis, blandit tincidunt felis. Donec commodo nulla
                commodo, venenatis nisi ac, porttitor eros. Pellentesque
                pellentesque neque vitae massa placerat, in congue justo
                iaculis.
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two" className="font-medium text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse id nunc ante. Suspendisse nisi justo, auctor sed
                tellus quis, blandit tincidunt felis. Donec commodo nulla
                commodo, venenatis nisi ac, porttitor eros. Pellentesque
                pellentesque neque vitae massa placerat, in congue justo
                iaculis.
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="option-three" id="option-three" />
              <Label htmlFor="option-three" className="font-medium text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse id nunc ante. Suspendisse nisi justo, auctor sed
                tellus quis, blandit tincidunt felis. Donec commodo nulla
                commodo, venenatis nisi ac, porttitor eros. Pellentesque
                pellentesque neque vitae massa placerat, in congue justo
                iaculis.
              </Label>
            </div>
          </RadioGroup>

          <div className="flex flex-row justify-between pt-3">
            <Button variant="default">Prev</Button>
            <Button variant="default">Next</Button>
          </div>
        </CardDescription>
      </Card>

      <Modal open={successModalOpen}>
        <ModalCenter closeButton={false} className="max-md:min-w-[70vw]">
          <ModalContent className="text-center space-y-5 flex flex-col items-center">
            <h1 className="text-3xl text-center text-cyan-950 font-semibold">
              Are you sure?
            </h1>
            <div className="flex flex-row gap-4 justify-between w-full">
              <Button
                className="w-full bg-slate-600 hover:bg-slate-500"
                onClick={() => {
                  setSuccessModalOpen(false);
                }}
                variant={"default"}
              >
                Go back
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  navigate("/tryout/view/id");
                }}
                variant={"default"}
              >
                Submit
              </Button>
            </div>
          </ModalContent>
        </ModalCenter>
      </Modal>
    </div>
  );
}
