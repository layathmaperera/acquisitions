// javascript
import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async (password) => {
  try {
    return bcrypt.hash(password, 10);
  } catch (error) {
    logger.error(`Error hashing the password: ${error}`);
    throw new Error('Password hashing failed');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error(`Error comparing passwords: ${error}`);
    throw new Error('Password comparison failed');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(users.email.eq(email));

    const user = rows[0];

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    logger.error('Authentication failed', error);
    throw error;
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const hashedPassword = await hashPassword(password);

    console.log('Attempting to insert user:', { name, email, role }); // Debug log

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      });

    console.log('User created successfully:', newUser); // Debug log
    return newUser;
  } catch (error) {
    // Log the FULL error object
    console.error('Full error:', JSON.stringify(error, null, 2));
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    console.error('Error cause:', error.cause);

    const isUniqueViolation =
      error?.code === '23505' ||
      error?.cause?.sourceError?.code === '23505' ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('duplicate'));

    if (isUniqueViolation) {
      logger.info('Create user aborted - user already exists', { email });
      throw new Error('User already exists');
    }

    logger.error('Create user failed', error);
    throw error;
  }
};