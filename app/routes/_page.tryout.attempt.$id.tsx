import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import TryoutAttemptModule from "~/modules/TryoutModule/attempt";
import { TryoutAttemptLoader } from "~/modules/TryoutModule/attempt/loader";
import { TryoutAttemptAction } from "~/modules/TryoutModule/attempt/action";

export async function loader(args: LoaderFunctionArgs) {
  return await TryoutAttemptLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await TryoutAttemptAction(args);
}

export default function index() {
  return <TryoutAttemptModule />;
}
