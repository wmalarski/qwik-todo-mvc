import { RequestEvent, RequestEventLoader } from "@builder.io/qwik-city";
import jwt from 'jsonwebtoken';
import { env } from "./env";

export type Session = {
  userId: string;
}

const options = {
  httpOnly: true,
  maxAge: 0,
  name: "__session",
  path: "/",
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
} as const;

export const USER_SESSION_KEY = "__session";

export const createSession = (
  request: RequestEventLoader | RequestEvent,
  userId: string,
) => {
  const token = jwt.sign({ userId }, env.SESSION_SECRET, {expiresIn: "7d"});

  request.cookie.set(USER_SESSION_KEY, token, {
    ...options,
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export const deleteSession = (request: RequestEventLoader | RequestEvent) => {
  request.cookie.delete(USER_SESSION_KEY);
}

export const getSession = (request: RequestEventLoader | RequestEvent): Session | null => {
  const token = request.cookie.get(USER_SESSION_KEY)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = jwt.verify(token, env.SESSION_SECRET);

    console.log({ session });

    return { userId: session.toString() };
  } catch(err) {
    deleteSession(request);
    return null;
  }
}

