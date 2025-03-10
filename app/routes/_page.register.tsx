import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import RegisterModule from "~/modules/RegisterModule";
import { RegisterLoader } from "~/modules/RegisterModule/loader";
import { RegisterAction } from "~/modules/RegisterModule/action";

export async function loader(args: LoaderFunctionArgs) {
  return await RegisterLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await RegisterAction(args);
}

export default function index() {
  return <RegisterModule />;
}
