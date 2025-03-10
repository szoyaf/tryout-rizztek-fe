import { type ActionFunctionArgs } from "@remix-run/node";
import { LogoutApiAction } from "~/modules/LogoutApi";

export async function action(args: ActionFunctionArgs) {
  return await LogoutApiAction(args);
}
