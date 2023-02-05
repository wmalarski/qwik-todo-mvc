import { ProtectedRequestContext } from "./context";

type CreateTodo = {
  ctx: ProtectedRequestContext;
  title: string;
};

export const createTodo = ({ ctx, title }: CreateTodo) => {
  return ctx.prisma.todo.create({
    data: {
      complete: false,
      title,
      userId: ctx.session.userId,
    },
  });
};

type ToggleTodo = {
  ctx: ProtectedRequestContext;
  id: string;
  complete: boolean;
};

export const toggleTodo = ({ ctx, id, complete }: ToggleTodo) => {
  return ctx.prisma.todo.updateMany({
    data: { complete },
    where: { id, userId: ctx.session.userId },
  });
};

type CompleteAllTodos = {
  ctx: ProtectedRequestContext;
  complete: boolean;
};

export const completeAllTodos = ({ ctx, complete }: CompleteAllTodos) => {
  return ctx.prisma.todo.updateMany({
    data: { complete },
    where: { userId: ctx.session.userId },
  });
};

type UpdateTodo = {
  ctx: ProtectedRequestContext;
  id: string;
  title: string;
};

export const updateTodo = ({ ctx, id, title }: UpdateTodo) => {
  return ctx.prisma.todo.updateMany({
    data: { title },
    where: { id, userId: ctx.session.userId },
  });
};

type DeleteTodo = {
  ctx: ProtectedRequestContext;
  id: string;
};

export const deleteTodo = ({ ctx, id }: DeleteTodo) => {
  return ctx.prisma.todo.deleteMany({
    where: { id, userId: ctx.session.userId },
  });
};

type DeleteCompletedTodos = {
  ctx: ProtectedRequestContext;
};

export const deleteCompletedTodos = ({ ctx }: DeleteCompletedTodos) => {
  return ctx.prisma.todo.deleteMany({
    where: { complete: true, userId: ctx.session.userId },
  });
};

export type FilterKind = "active" | "complete" | "all";

type FindTodos = {
  ctx: ProtectedRequestContext;
  filter: FilterKind;
};

export const findTodos = ({ ctx, filter }: FindTodos) => {
  const complete =
    filter === "active" ? false : filter === "complete" ? true : undefined;

  return ctx.prisma.todo.findMany({
    orderBy: { createdAt: "asc" },
    select: { complete: true, createdAt: true, id: true, title: true },
    where: { complete, userId: ctx.session.userId },
  });
};

type CountTodos = {
  ctx: ProtectedRequestContext;
};

export const countTodos = async ({ ctx }: CountTodos) => {
  const result = await ctx.prisma.todo.groupBy({
    _count: { complete: true },
    by: ["complete"],
    where: { userId: ctx.session.userId },
  });

  const all = result.reduce((prev, curr) => {
    return prev + curr._count.complete;
  }, 0);

  return result.reduce<Record<FilterKind, number>>(
    (prev, curr) => {
      const key = curr.complete ? "complete" : "active";
      prev[key] = curr._count.complete;
      return prev;
    },
    { active: 0, all, complete: 0 }
  );
};
