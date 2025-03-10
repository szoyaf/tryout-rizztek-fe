import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import LoginModule from "~/modules/LoginModule";
import { LoginLoader } from "~/modules/LoginModule/loader";
import { LoginAction } from "~/modules/LoginModule/action";

export async function loader(args: LoaderFunctionArgs) {
  return await LoginLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await LoginAction(args);
}

export default function index() {
  return <LoginModule />;
}
