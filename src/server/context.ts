import type { RequestEvent, RequestEventLoader } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { getSession, Session } from "./auth";
import { DbPrismaClient, prisma } from "./db";

export type RequestContext = {
  prisma: DbPrismaClient;
};

export type ProtectedRequestContext = {
  prisma: DbPrismaClient;
  session: Session;
};

export const getRequestContext = (): RequestContext => {
  return { prisma };
};

export const getProtectedRequestContext = (
  event: RequestEventLoader | RequestEvent
): ProtectedRequestContext => {
  const session = getSession(event);

  if (!session) {
    throw event.redirect(302, paths.home);
  }

  return { prisma, session };
};
