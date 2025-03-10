import * as jwt from "jsonwebtoken";
import { UserData, User, GetUserResponse } from "./interface";

export async function getUserData(token: string): Promise<User | null> {
  const API_URL = process.env.SERVER_URL;

  if (!token) {
    return null;
  }

  try {
    const user = jwt.decode(token) as UserData;

    if (!user || !user.id) {
      return null;
    }

    const response = await fetch(`${API_URL}api/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    } else {
      const data: GetUserResponse = await response.json();

      if (!data.user) {
        return null;
      }

      return {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        tryouts: data.user.tryouts,
        submissions: data.user.submissions,
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
