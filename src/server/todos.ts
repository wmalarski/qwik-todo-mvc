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
