import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6).max(100),
  // Role is NOT accepted during signup — always defaults to 'citizen'
  // Only admins can promote users via PUT /api/users/:id
});

// Valid roles for the civic engagement realm
export const VALID_ROLES = ['citizen', 'official', 'admin'];

export const signinSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6).max(100),
});

