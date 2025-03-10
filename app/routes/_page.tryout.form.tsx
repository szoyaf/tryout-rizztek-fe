import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import TryoutFormModule from "~/modules/TryoutModule/form";
import { TryoutFormLoader } from "~/modules/TryoutModule/form/loader";
import { TryoutFormAction } from "~/modules/TryoutModule/form/action";

export async function loader(args: LoaderFunctionArgs) {
  return await TryoutFormLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await TryoutFormAction(args);
}

export default function index() {
  return <TryoutFormModule />;
}
