import { promises as fs } from "fs";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect
} from "kysely";
import * as path from "path";
import { Pool } from "pg";

const migrateToLatest = async () => {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        user: process.env.DB_USER,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: "./migrations",
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
