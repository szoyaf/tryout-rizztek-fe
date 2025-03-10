import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import LandingModule from "~/modules/LandingModule";
import { LandingLoader } from "~/modules/LandingModule/loader";
import { LandingAction } from "~/modules/LandingModule/action";

export async function loader(args: LoaderFunctionArgs) {
  return await LandingLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return await LandingAction(args);
}

export default function index() {
  return <LandingModule />;
}
