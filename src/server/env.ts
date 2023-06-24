import { z, type RequestEventCommon } from "@builder.io/qwik-city";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const getEnvSchema = () => {
  return z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.string().default("production"),
    SESSION_SECRET: z.string(),
  });
};

export const serverEnv = (
  event: RequestEventCommon
): z.infer<ReturnType<typeof getEnvSchema>> => {
  const cached = event.sharedMap.get("env");
  if (cached) {
    return cached;
  }

  const envSchema = getEnvSchema();

  const parsed = envSchema.parse({
    DATABASE_URL: event.env.get("DATABASE_URL"),
    NODE_ENV: event.env.get("NODE_ENV"),
    SESSION_SECRET: event.env.get("SESSION_SECRET"),
  });

  event.sharedMap.set("env", parsed);

  return parsed;
};
