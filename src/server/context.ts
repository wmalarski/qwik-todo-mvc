import type { RequestEventCommon } from "@builder.io/qwik-city";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "~/db/db";
import { passwords, todos, users } from "~/db/schema";
import { paths } from "~/utils/paths";
import { getSession, type Session } from "./auth";

export type RequestContext = {
  db: NodePgDatabase;
  schema: {
    passwords: typeof passwords;
    todos: typeof todos;
    users: typeof users;
  };
  session: Session | null;
};

export type ProtectedRequestContext = {
  db: NodePgDatabase;
  session: Session;
  schema: RequestContext["schema"];
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
  return { db, schema: { passwords, todos, users }, session };
};

export const getProtectedRequestContext = (
  event: RequestEventCommon
): ProtectedRequestContext => {
  const session = getRequestSession(event);

  if (!session) {
    throw event.redirect(302, paths.signIn);
  }

  return { db, schema: { passwords, todos, users }, session };
};
