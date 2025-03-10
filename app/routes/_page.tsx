import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUserData } from "~/auth/getUserData";
import { isTokenValid, token } from "~/auth/token";
import Footer from "~/components/layout/Footer";
import { Navbar } from "~/components/layout/Navbar";
import { Toaster } from "~/components/ui/sonner";

const unprotectedRoutes = ["/login", "/register"];

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const t = await token.parse(cookieHeader);

  const url = new URL(request.url);
  const isAuthPage = unprotectedRoutes.includes(url.pathname);

  if (!isAuthPage && !(await isTokenValid(t))) {
    return redirect("/login", {});
  }

  return {
    isLoggedIn: await isTokenValid(t),
    userData: await getUserData(t),
  };
}

export default function Index() {
  return (
    <main className="bg-cyan-900 text-slate-200">
      <Navbar />
      <main className="pt-16 max-w-[1920px] mx-auto h-fit min-h-screen overflow-x-hidden">
        <Outlet />
        <Toaster />
        <Footer />
      </main>
    </main>
  );
}
