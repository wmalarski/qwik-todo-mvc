import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

dotenv.config();

const runMigrations = async () => {
  const connectionString = process.env.VITE_DATABASE_URL;

  const pool = new Pool({ connectionString });

  const db = drizzle(pool);

  const result = await migrate(db, { migrationsFolder: "./migrations" });

  console.log({ result });
};

runMigrations()
  .then(() => {
    console.log("Migrations ran successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
