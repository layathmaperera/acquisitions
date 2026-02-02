import express from 'express';
import { fetchAllUsers, getUserById, updateUser, deleteUser } from '#controllers/users.controller.js';
import { authenticate, requireRole } from '#middlewares/auth.middleware.js';

const router = express.Router();

// GET /users - get all users (admin only)
router.get('/', authenticate, requireRole(['admin']), fetchAllUsers);

// GET /users/:id - get user by id (authenticated users only)
router.get('/:id', authenticate, getUserById);

// PUT /users/:id - update user by ID (authenticated users can update own profile, admin can update any)
router.put('/:id', authenticate, updateUser);

// DELETE /users/:id - delete user by id (admin only)
router.delete('/:id', authenticate, requireRole(['admin']), deleteUser);

export default router;
