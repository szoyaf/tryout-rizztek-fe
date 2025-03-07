import * as jwt from "jsonwebtoken";

export interface userData {
  id: string;
  username: string;
  email: string;
}

export async function getUserData(token: string): Promise<userData> {
  return jwt.decode(token) as userData;
}
