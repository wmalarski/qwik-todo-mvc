import { paths } from "~/utils/paths";
import { getSession, Session } from "./auth";
import { prisma, type DbPrismaClient } from "./db";
import type { ServerRequest } from "./types";

export type RequestContext = {
  prisma: DbPrismaClient;
  session: Session | null;
};

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
};

const getRequestSession = (event: ServerRequest): Session | null => {
  const session = event.sharedMap.get("session");
  if (session) {
    return session;
  }
  const newSession = getSession(event);
  event.sharedMap.set("session", newSession);
  return newSession;
};

export const getRequestContext = (event: ServerRequest): RequestContext => {
  const session = getRequestSession(event);
  return { prisma, session };
};

export const getProtectedRequestContext = (
  event: ServerRequest
): ProtectedRequestContext => {
  const session = getRequestSession(event);

  if (!session) {
    throw event.redirect(302, paths.signIn);
  }

  return { prisma, session };
};
