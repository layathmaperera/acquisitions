import {pgTable,serial,timestamp,varchar} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 255}).notNull(),
  email: varchar('email', {length: 255}).notNull().unique(),
  password: varchar('password', {length: 255}).notNull(),
  role: varchar('role', {length: 50}).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

});
