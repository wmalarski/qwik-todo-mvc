import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("password")
    .addColumn("user_id", "serial", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("email", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("password_user_id_index")
    .on("password")
    .column("user_id")
    .execute();

  await db.schema
    .createTable("todo")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("completed", "boolean", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("user_id", "serial", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .execute();

  await db.schema
    .createIndex("todo_user_id_index")
    .on("todo")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("todo_user_id_index").execute();
  await db.schema.dropTable("todo").execute();

  await db.schema.dropIndex("password_user_id_index").execute();
  await db.schema.dropTable("password").execute();

  await db.schema.dropTable("user").execute();
}
