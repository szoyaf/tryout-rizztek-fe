import { Link, useLoaderData } from "@remix-run/react";
// import { userData } from "~/auth/getUserData";
import { Button } from "../../ui/button";

export const Navbar = () => {
  const logout = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (token) {
      await fetch(`${API_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        window.location.reload();
      });
    }
  };

  // const data: {
  //   isLoggedIn: boolean;
  //   userData: userData;
  // } = useLoaderData();

  const data = {
    isLoggedIn: true,
    userData: {
      name: "John Doe",
    },
  };

  return (
    <nav className="fixed top-0 shadow-md p-4 px-5 sm:px-20 w-full bg-cyan-950 z-50">
      <div className="flex gap-2 justify-between items-center">
        <Link to="/">
          <div className="text-xl font-bold text-slate-100">TryoutRizztek</div>
        </Link>

        <div className="flex gap-9 max-md:gap-7 max-sm:gap-4 items-center">
          {data?.isLoggedIn ? (
            <Button variant="default" onClick={logout} className="">
              Logout
            </Button>
          ) : (
            !data?.isLoggedIn && (
              <form method="POST" action="/login">
                <Button variant="default" type="submit" className="">
                  Login
                </Button>
              </form>
            )
          )}
        </div>
      </div>
    </nav>
  );
};
