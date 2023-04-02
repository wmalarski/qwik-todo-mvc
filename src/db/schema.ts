import type { InferModel } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type UpdateModel<T extends { id: string }> = Partial<T> & { id: string };

export const users = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: text("email").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = InferModel<typeof users>;
export type InsertUser = InferModel<typeof users, "insert">;
export type UpdateUser = UpdateModel<InferModel<typeof users>>;

export const passwords = pgTable("passwords", {
  hash: varchar("hash").notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});

export type Password = InferModel<typeof passwords>;
export type InsertPassword = InferModel<typeof passwords, "insert">;
export type SecurePassword = Omit<Password, "hash">;

export const todos = pgTable("todos", {
  complete: boolean("complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});

export type Todo = InferModel<typeof todos>;
export type InsertTodo = InferModel<typeof todos, "insert">;
export type UpdateTodo = UpdateModel<InferModel<typeof todos>>;
