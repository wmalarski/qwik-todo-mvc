import { RequestEvent, RequestEventLoader } from "@builder.io/qwik-city";
import jwt from "jsonwebtoken";
import { env } from "./env";

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

export const createSession = (
  event: RequestEventLoader | RequestEvent,
  userId: string
) => {
  const token = jwt.sign({ userId }, env.SESSION_SECRET, { expiresIn: "7d" });

  event.cookie.set(USER_SESSION_KEY, token, {
    ...options,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const deleteSession = (event: RequestEventLoader | RequestEvent) => {
  event.cookie.delete(USER_SESSION_KEY, options);
};

export const getSession = (
  event: RequestEventLoader | RequestEvent
): Session | null => {
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
