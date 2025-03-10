import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import TryoutEditModule from "~/modules/TryoutModule/edit";
import { TryoutEditLoader } from "~/modules/TryoutModule/edit/loader";
import { TryoutEditAction } from "~/modules/TryoutModule/edit/action";

export async function loader(args: LoaderFunctionArgs) {
  return await TryoutEditLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await TryoutEditAction(args);
}

export default function index() {
  return <TryoutEditModule />;
}
