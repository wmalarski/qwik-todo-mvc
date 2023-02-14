import type { RequestEventCommon } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { getSession, type Session } from "./auth";
import { prisma, type DbPrismaClient } from "./db";

export type RequestContext = {
  prisma: DbPrismaClient;
  session: Session | null;
};

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
};

const getRequestSession = (event: RequestEventCommon): Session | null => {
  const value = event.sharedMap.get("session");
  if (value) {
    return value.session;
  }
  const session = getSession(event);
  event.sharedMap.set("session", { session });
  return session;
};

export const getRequestContext = (
  event: RequestEventCommon
): RequestContext => {
  const session = getRequestSession(event);
  return { prisma, session };
};

export const getProtectedRequestContext = (
  event: RequestEventCommon
): ProtectedRequestContext => {
  const session = getRequestSession(event);

  if (!session) {
    throw event.redirect(302, paths.signIn);
  }

  return { prisma, session };
};
