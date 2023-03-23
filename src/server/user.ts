import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm/expressions";
import type { ProtectedRequestContext, RequestContext } from "./context";

type GetCurrentUser = {
  ctx: ProtectedRequestContext;
};

export const getCurrentUser = ({ ctx }: GetCurrentUser) => {
  return ctx.db
    .select()
    .from(ctx.schema.users)
    .where(eq(ctx.schema.users.id, ctx.session.userId))
    .limit(1)
    .then((r) => r[0]);
};

type GetUser = {
  ctx: RequestContext;
  email: string;
};

export const getUser = ({ ctx, email }: GetUser) => {
  return ctx.db
    .select()
    .from(ctx.schema.users)
    .where(eq(ctx.schema.users.email, email))
    .limit(1)
    .then((r) => r[0]);
};

type CreateUser = {
  ctx: RequestContext;
  email: string;
  password: string;
};

export const createUser = async ({ ctx, email, password }: CreateUser) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const users = await ctx.db
    .insert(ctx.schema.users)
    .values({ email })
    .returning();

  const user = users[0];

  await ctx.db.insert(ctx.schema.passwords).values({
    hash: hashedPassword,
    userId: user.id,
  });

  return user;
};

type VerifyLogin = {
  ctx: RequestContext;
  email: string;
  password: string;
};

export const verifyLogin = async ({ ctx, email, password }: VerifyLogin) => {
  const userWithPassword = await ctx.db
    .select()
    .from(ctx.schema.users)
    .leftJoin(
      ctx.schema.passwords,
      eq(ctx.schema.users.id, ctx.schema.passwords.userId)
    )
    .where(eq(ctx.schema.users.email, email))
    .limit(1)
    .then((r) => r[0]);

  if (!userWithPassword || !userWithPassword.passwords?.hash) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.passwords.hash
  );

  if (!isValid) {
    return null;
  }

  return userWithPassword.users;
};
