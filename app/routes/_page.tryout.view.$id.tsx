import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import TryoutViewModule from "~/modules/TryoutModule/view";
import { TryoutViewLoader } from "~/modules/TryoutModule/view/loader";
import { TryoutViewAction } from "~/modules/TryoutModule/view/action";

export async function loader(args: LoaderFunctionArgs) {
  return await TryoutViewLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await TryoutViewAction(args);
}

export default function index() {
  return <TryoutViewModule />;
}
