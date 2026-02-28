import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { z } from 'zod';

import * as schema from './schema';

dotenv.config();

const Env = z
  .object({
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string().default('5432'),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
  })
  .transform((env) => ({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    ssl: false as const,
  }));

export const dbCredentials = Env.parse(process.env);

export const pool = new Pool(dbCredentials);

export const db = drizzle(pool, { schema });

export type DbClient = typeof db;