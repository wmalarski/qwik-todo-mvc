import { and, eq, sql } from "drizzle-orm";
import type { ProtectedRequestContext } from "./context";

type CreateTodo = {
  ctx: ProtectedRequestContext;
  title: string;
};

export const createTodo = ({ ctx, title }: CreateTodo) => {
  return ctx.db
    .insert(ctx.schema.todos)
    .values({ complete: false, title, userId: ctx.session.userId })
    .returning();
};

type ToggleTodo = {
  ctx: ProtectedRequestContext;
  id: string;
  complete: boolean;
};

export const toggleTodo = ({ ctx, id, complete }: ToggleTodo) => {
  return ctx.db
    .update(ctx.schema.todos)
    .set({ complete })
    .where(
      and(
        eq(ctx.schema.todos.id, id),
        eq(ctx.schema.todos.userId, ctx.session.userId)
      )
    )
    .returning();
};

type CompleteAllTodos = {
  ctx: ProtectedRequestContext;
  complete: boolean;
};

export const completeAllTodos = ({ ctx, complete }: CompleteAllTodos) => {
  return ctx.db
    .update(ctx.schema.todos)
    .set({ complete })
    .where(eq(ctx.schema.todos.userId, ctx.session.userId))
    .returning();
};

type UpdateTodo = {
  ctx: ProtectedRequestContext;
  id: string;
  title: string;
};

export const updateTodo = ({ ctx, id, title }: UpdateTodo) => {
  return ctx.db
    .update(ctx.schema.todos)
    .set({ title })
    .where(
      and(
        eq(ctx.schema.todos.id, id),
        eq(ctx.schema.todos.userId, ctx.session.userId)
      )
    )
    .returning();
};

type DeleteTodo = {
  ctx: ProtectedRequestContext;
  id: string;
};

export const deleteTodo = ({ ctx, id }: DeleteTodo) => {
  return ctx.db
    .delete(ctx.schema.todos)
    .where(
      and(
        eq(ctx.schema.todos.id, id),
        eq(ctx.schema.todos.userId, ctx.session.userId)
      )
    );
};

type DeleteCompletedTodos = {
  ctx: ProtectedRequestContext;
};

export const deleteCompletedTodos = ({ ctx }: DeleteCompletedTodos) => {
  return ctx.db
    .delete(ctx.schema.todos)
    .where(
      and(
        eq(ctx.schema.todos.complete, true),
        eq(ctx.schema.todos.userId, ctx.session.userId)
      )
    );
};

export type FilterKind = "active" | "complete" | "all";

type FindTodos = {
  ctx: ProtectedRequestContext;
  filter: FilterKind;
};

export const findTodos = ({ ctx, filter }: FindTodos) => {
  const userEq = eq(ctx.schema.todos.userId, ctx.session.userId);

  const where =
    filter === "active"
      ? and(eq(ctx.schema.todos.complete, false), userEq)
      : filter === "complete"
      ? and(eq(ctx.schema.todos.complete, true), userEq)
      : userEq;

  return ctx.db
    .select()
    .from(ctx.schema.todos)
    .where(where)
    .orderBy(ctx.schema.todos.createdAt);
};

type CountTodos = {
  ctx: ProtectedRequestContext;
};

export const countTodos = async ({ ctx }: CountTodos) => {
  const result = await ctx.db
    .select({
      complete: ctx.schema.todos.complete,
      count: sql<number>`count(${ctx.schema.todos.complete})`,
    })
    .from(ctx.schema.todos)
    .where(eq(ctx.schema.todos.userId, ctx.session.userId))
    .groupBy(ctx.schema.todos.complete);

  const all = result.reduce((prev, curr) => {
    return prev + curr.count;
  }, 0);

  return result.reduce<Record<FilterKind, number>>(
    (prev, curr) => {
      const key = curr.complete ? "complete" : "active";
      prev[key] = curr.count;
      return prev;
    },
    { active: 0, all, complete: 0 }
  );
};
