import { useSubmit } from "@remix-run/react";
import { useCallback } from "react";

export function useLogout() {
  const submit = useSubmit();

  const logout = useCallback(() => {
    submit(null, { method: "post", action: "/api/logout" });
  }, [submit]);

  const logoutWithFeedback = useCallback(async () => {
    try {
      submit(null, { method: "post", action: "/api/logout" });
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }, [submit]);

  return { logout, logoutWithFeedback };
}
