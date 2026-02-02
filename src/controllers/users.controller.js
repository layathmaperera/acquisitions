import logger from '#config/logger.js';
import { getAllUsers, getUserById as getUserByIdService, updateUser as updateUserService, deleteUser as deleteUserService } from '#Services/users.services.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validations.js';

//logging,validatations
export const fetchAllUsers = async (req, res) => {

  try {
    logger.info('Fetching users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully fetched users',
      users: allUsers,
      count: allUsers.length,
    });
  }catch(err) {
    logger.error('Error fetching users', err);
    // next(err);

  }
};

export const getUserById = async (req, res) => {
  try {
    logger.info(`Fetching user by id: ${req.params.id}`);

    // Validate request params
    const validation = userIdSchema.safeParse({ id: req.params.id });
    if (!validation.success) {
      logger.warn('Invalid user id format', validation.error.errors);
      return res.status(400).json({
        message: 'Invalid user id',
        errors: validation.error.errors,
      });
    }

    const { id } = validation.data;
    const user = await getUserByIdService(id);

    if (!user) {
      logger.warn(`User not found with id: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Successfully fetched user',
      user,
    });
  } catch (err) {
    logger.error('Error fetching user by id', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    logger.info(`Updating user with id: ${req.params.id}`);

    // Validate request params
    const idValidation = userIdSchema.safeParse({ id: req.params.id });
    if (!idValidation.success) {
      logger.warn('Invalid user id format', idValidation.error.errors);
      return res.status(400).json({
        message: 'Invalid user id',
        errors: idValidation.error.errors,
      });
    }

    // Validate request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      logger.warn('Invalid update data', bodyValidation.error.errors);
      return res.status(400).json({
        message: 'Invalid update data',
        errors: bodyValidation.error.errors,
      });
    }

    const { id } = idValidation.data;
    const updates = bodyValidation.data;

    // Check if authenticated user exists
    if (!req.user) {
      logger.warn('Unauthorized update attempt - no user in request');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Users can only update their own information
    if (req.user.id !== id && req.user.role !== 'admin') {
      logger.warn(`User ${req.user.id} attempted to update user ${id}`);
      return res.status(403).json({ message: 'Forbidden: You can only update your own information' });
    }

    // Only admins can change roles
    if (updates.role && req.user.role !== 'admin') {
      logger.warn(`Non-admin user ${req.user.id} attempted to change role`);
      return res.status(403).json({ message: 'Forbidden: Only admins can change user roles' });
    }

    const updatedUser = await updateUserService(id, updates);

    logger.info(`User ${id} updated successfully`);
    res.json({
      message: 'Successfully updated user',
      user: updatedUser,
    });
  } catch (err) {
    if (err.message === 'User not found') {
      logger.warn(`User not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.error('Error updating user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    logger.info(`Deleting user with id: ${req.params.id}`);

    // Validate request params
    const validation = userIdSchema.safeParse({ id: req.params.id });
    if (!validation.success) {
      logger.warn('Invalid user id format', validation.error.errors);
      return res.status(400).json({
        message: 'Invalid user id',
        errors: validation.error.errors,
      });
    }

    const { id } = validation.data;

    // Check if authenticated user exists
    if (!req.user) {
      logger.warn('Unauthorized delete attempt - no user in request');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Users can only delete their own account, admins can delete any
    if (req.user.id !== id && req.user.role !== 'admin') {
      logger.warn(`User ${req.user.id} attempted to delete user ${id}`);
      return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
    }

    const deletedUser = await deleteUserService(id);

    if (!deletedUser) {
      logger.warn(`User not found for deletion: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`User ${id} deleted successfully`);
    res.json({ message: 'Successfully deleted user' });
  } catch (err) {
    logger.error('Error deleting user', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
