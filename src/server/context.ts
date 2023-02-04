import type { RequestEvent, RequestEventLoader } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { getSession, Session } from "./auth";
import { DbPrismaClient, prisma } from "./db";

export type RequestContext = {
  prisma: DbPrismaClient;
  session: Session | null;
};

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
};

const getRequestSession = (
  event: RequestEventLoader | RequestEvent
): Session | null => {
  const session = event.sharedMap.get("session");
  if (session) {
    return session;
  }
  const newSession = getSession(event);
  event.sharedMap.set("session", newSession);
  return newSession;
};

export const getRequestContext = (
  event: RequestEventLoader | RequestEvent
): RequestContext => {
  const session = getRequestSession(event);
  return { prisma, session };
};

export const getProtectedRequestContext = (
  event: RequestEventLoader | RequestEvent
): ProtectedRequestContext => {
  const session = getRequestSession(event);

  if (!session) {
    throw event.redirect(302, paths.signIn);
  }

  return { prisma, session };
};
