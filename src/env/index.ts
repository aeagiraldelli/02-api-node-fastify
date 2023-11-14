import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const zodResult = envSchema.safeParse(process.env);

if (!zodResult.success) {
  const message = `Invalid environment variables!\n\n${zodResult.error.format()}`;
  throw new Error(message);
}

export const env = zodResult.data;