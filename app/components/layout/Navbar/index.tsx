import { Link, useLoaderData } from "@remix-run/react";
import { UserData } from "~/auth/interface";
import { Button } from "../../ui/button";
import { useLogout } from "~/auth/useLogout";

export const Navbar = () => {
  const { logout } = useLogout();

  const data: {
    isLoggedIn: boolean;
    userData: UserData;
  } = useLoaderData();

  return (
    <nav className="fixed top-0 shadow-md p-4 px-5 sm:px-20 w-full bg-cyan-950 z-50">
      <div
        className={`flex gap-2 ${
          data?.isLoggedIn ? "justify-between" : "justify-start"
        } items-center`}
      >
        <Link to="/">
          <div className="text-xl font-bold text-slate-100">TryoutRizztek</div>
        </Link>

        {data?.isLoggedIn && (
          <div className="flex gap-9 max-md:gap-7 max-sm:gap-4 items-center">
            <Button variant="default" onClick={logout} className="">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
