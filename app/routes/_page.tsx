import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
// import { getUserData } from '~/auth/getUserData';;
import Footer from "~/components/layout/Footer";
import { Navbar } from "~/components/layout/Navbar";

// const unprotectedRoutes = ['/login', '/register'];

export async function loader({ request }: LoaderFunctionArgs) {
  // const cookieHeader = request.headers.get('Cookie');
  // const token = cookieHeader?.split(';').find(row => row.startsWith('token='))?.split('=')[1];

  // const url = new URL(request.url);
  // const isAuthPage = unprotectedRoutes.includes(url.pathname);

  // return {
  //   isLoggedIn: await isTokenValid(token),
  //   userData: await getUserData(token),
  // };
  return null;
}

export default function Index() {
  return (
    <main className="bg-cyan-900 text-slate-200">
      <Navbar />
      <main className="pt-16 max-w-[1920px] mx-auto min-h-screen overflow-x-hidden">
        <Outlet />
        <Footer />
      </main>
    </main>
  );
}
