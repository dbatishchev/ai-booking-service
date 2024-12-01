import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import * as dotenv from "dotenv";

dotenv.config();

console.log("process.env.DATABASE_URL");
console.log(process.env.DATABASE_URL);

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});