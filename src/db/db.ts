import type { RequestEventCommon } from "@builder.io/qwik-city";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import { serverEnv } from "~/server/env";

declare global {
  // eslint-disable-next-line no-var
  var db: NodePgDatabase | undefined;
}

export const createDrizzle = (event: RequestEventCommon) => {
  const env = serverEnv(event);
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

  return drizzle(pool);
};

export const getDrizzle = (event: RequestEventCommon) => {
  const sharedDrizzle = event.sharedMap.get("drizzle");
  if (sharedDrizzle) {
    return sharedDrizzle as ReturnType<typeof createDrizzle>;
  }

  // HOT reload cache
  const env = serverEnv(event);
  if (env.NODE_ENV !== "production" && typeof global !== "undefined") {
    if (!global.db) {
      global.db = createDrizzle(event);
      event.sharedMap.set("drizzle", global.db);
    }
    return global.db;
  }

  const drizzle = createDrizzle(event);
  event.sharedMap.set("drizzle", drizzle);

  return drizzle;
};
