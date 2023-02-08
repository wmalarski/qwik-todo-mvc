import jwt from "jsonwebtoken";
import { env } from "./env";
import type { ServerRequest } from "./types";

export type Session = {
  userId: string;
  iat: number;
  exp: number;
};

const options = {
  httpOnly: true,
  maxAge: 0,
  name: "__session",
  path: "/",
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
} as const;

export const USER_SESSION_KEY = "__session";

export const createSession = (event: ServerRequest, userId: string) => {
  const token = jwt.sign({ userId }, env.SESSION_SECRET, { expiresIn: "7d" });

  event.cookie.set(USER_SESSION_KEY, token, {
    ...options,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  // somehow cookie.set is not working right now
  event.headers.set("Set-Cookie", event.cookie.headers()[0]);
};

export const deleteSession = (event: ServerRequest) => {
  event.cookie.delete(USER_SESSION_KEY, options);

  // somehow cookie.delete is not working right now
  event.headers.set("Set-Cookie", event.cookie.headers()[0]);
};

export const getSession = (event: ServerRequest): Session | null => {
  const token = event.cookie.get(USER_SESSION_KEY)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = jwt.verify(token, env.SESSION_SECRET);
    return session as Session;
  } catch (err) {
    deleteSession(event);
    return null;
  }
};
