import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "~/server/env";

declare global {
  // eslint-disable-next-line no-var
  var db: NodePgDatabase | undefined;
}

export const createDrizzle = () => {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  return drizzle(pool);
};

export const db =
  typeof global !== "undefined"
    ? global.db || createDrizzle()
    : createDrizzle();

if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
  global.db = db;
}
