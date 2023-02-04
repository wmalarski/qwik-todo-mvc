import bcrypt from "bcryptjs";
import type { ProtectedRequestContext, RequestContext } from "./context";

type GetCurrentUser = {
  ctx: ProtectedRequestContext;
};

export const getCurrentUser = ({ ctx }: GetCurrentUser) => {
  return ctx.prisma.user.findUnique({ where: { id: ctx.session.userId } });
};

type GetUser = {
  ctx: RequestContext;
  email: string;
};

export const getUser = ({ ctx, email }: GetUser) => {
  return ctx.prisma.user.findUnique({ where: { email } });
};

type CreateUser = {
  ctx: RequestContext;
  email: string;
  password: string;
};

export const createUser = async ({ ctx, email, password }: CreateUser) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return ctx.prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
};

type VerifyLogin = {
  ctx: RequestContext;
  email: string;
  password: string;
};

export const verifyLogin = async ({ ctx, email, password }: VerifyLogin) => {
  const userWithPassword = await ctx.prisma.user.findUnique({
    include: { password: true },
    where: { email },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
};
