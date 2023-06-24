import type { RequestEventCommon } from "@builder.io/qwik-city";
import jwt from "jsonwebtoken";
import { serverEnv } from "./env";

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
} as const;

const SESSION_COOKIE_KEY = "__session";
const SESSION_MAP_KEY = "__session";

export const createSession = (event: RequestEventCommon, userId: string) => {
  const env = serverEnv(event);
  const token = jwt.sign({ userId }, env.SESSION_SECRET, { expiresIn: "7d" });

  event.cookie.set(SESSION_COOKIE_KEY, token, {
    ...options,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: env.NODE_ENV === "production",
  });
};

export const deleteSession = (event: RequestEventCommon) => {
  event.cookie.delete(SESSION_COOKIE_KEY, options);
};

const getSession = (event: RequestEventCommon): Session | null => {
  const token = event.cookie.get(SESSION_COOKIE_KEY)?.value;
  const env = serverEnv(event);

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

export const getRequestSession = (
  event: RequestEventCommon
): Session | null => {
  const value = event.sharedMap.get(SESSION_MAP_KEY);
  if (value) {
    return value.session;
  }
  const session = getSession(event);
  event.sharedMap.set(SESSION_MAP_KEY, { session });
  return session;
};

export const clearRequestSession = (event: RequestEventCommon) => {
  event.sharedMap.set(SESSION_MAP_KEY, { session: null });
};
