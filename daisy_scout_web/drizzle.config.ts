import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { dbConnString } from '@/util/envHelper';

config({ path: '.env' });

export default defineConfig({
  schema: './db/schema.tsx',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbConnString,
  },
});
