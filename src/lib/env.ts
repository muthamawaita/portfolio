import { z } from "zod";

export const env = z.object({ DATABASE_URL: z.string().optional(), AUTH_SECRET: z.string().optional(), NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000") }).parse(process.env);