import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  // Logic to get all users

  try{
    return await db.select({
      id:users.id,
      email:users.email,
      name:users.name,
      role:users.role,
      created_at:users.created_at,
      updated_at:users.updated_at
    }).from(users);

  }catch (e){
    logger.error('Error getting all users', e);
    throw e;
  }
};

export const getUserById = async (id) => {
  try {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
      })
      .from(users)
      .where(eq(users.id, id));

    return rows[0] || null;
  } catch (e) {
    logger.error('Error getting user by id', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updated_at: new Date()
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at
      });

    return updatedUser;
  } catch (e) {
    logger.error('Error updating user', e);
    throw e;
  }
};

export const deleteUser = async (id) => {
  try {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return deletedUser || null;
  } catch (e) {
    logger.error('Error deleting user', e);
    throw e;
  }
};
