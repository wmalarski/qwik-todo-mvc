import { User } from "@prisma/client";
import { ProtectedRequestContext } from "./context";

type GetUser = {
  ctx: ProtectedRequestContext;
};

export const getUser = ({ ctx }: GetUser): Promise<User | null> => {
  return ctx.prisma.user.findUnique({ where: { id: ctx.session.userId } });
};
