import { z } from "@builder.io/qwik-city";

if (typeof window !== "undefined") {
  throw new Error("SERVER ON CLIENT!");
}

const envSchema = z.object({
  NODE_ENV: z.string().default("production"),
  SESSION_SECRET: z.string(),
});

export const env = envSchema.parse({
  SESSION_SECRET: import.meta.env.VITE_SESSION_SECRET,
  ...import.meta.env,
  ...process.env,
});
