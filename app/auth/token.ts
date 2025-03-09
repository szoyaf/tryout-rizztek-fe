import { createCookie } from '@remix-run/node';
import jwt from 'jsonwebtoken';
import { UserData } from './interface';

export const token = createCookie('token', {
  sameSite: 'lax',
  httpOnly: true,
  maxAge: 604_800,
});

export const isTokenValid = async (cookie: string) => {
  try {
    jwt.verify(cookie, process.env.JWT_SECRET as string);
    const data = (await jwt.decode(cookie)) as UserData;

    if (!data.email) {
      return false;
    }

    return cookie !== null && cookie !== undefined && cookie !== '';
  } catch (error) {
    return false;
  }
};
