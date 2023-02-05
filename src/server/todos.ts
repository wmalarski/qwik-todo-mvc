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

export type FilterKind = "active" | "complete" | undefined;

type FindTodos = {
  ctx: ProtectedRequestContext;
  filter: FilterKind;
};

export const findTodos = ({ ctx, filter }: FindTodos) => {
  const complete =
    filter === "active" ? false : filter === "complete" ? true : undefined;

  return ctx.prisma.todo.findMany({
    select: { complete: true, createdAt: true, id: true, title: true },
    where: {
      complete,
      userId: ctx.session.userId,
    },
  });
};
