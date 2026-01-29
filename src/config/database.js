import 'dotenv/config.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let connectionString;

if (process.env.NODE_ENV === 'development') {
  // In Docker: use the neon-local service
  // Outside Docker: use DATABASE_URL (your cloud database)
  connectionString = process.env.DATABASE_URL || 'postgres://neon:npg@neon-local:5432/neondb';
} else {
  // Production: always use DATABASE_URL
  connectionString = process.env.DATABASE_URL;
}

const sql = neon(connectionString);
const db = drizzle(sql);

export { db, sql };