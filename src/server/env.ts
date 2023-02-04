import { z } from "@builder.io/qwik-city";

const envSchema = z.object({
  NODE_ENV: z.string(),
  SESSION_SECRET: z.string(),
})

export const env = envSchema.parse({
  ...import.meta.env,
  ...process.env,
});


