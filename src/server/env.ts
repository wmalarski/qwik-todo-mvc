import { z } from "@builder.io/qwik-city";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.string().default("production"),
  SESSION_SECRET: z.string(),
});

export const env = envSchema.parse({
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  SESSION_SECRET: import.meta.env.VITE_SESSION_SECRET,
  ...import.meta.env,
  ...process.env,
});
