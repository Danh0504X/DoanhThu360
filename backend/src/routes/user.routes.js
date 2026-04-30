import express from 'express';
import {
  adminUpdateUserController,
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getUsersController)
  .post(createUserController);

router
  .route('/:id')
  .get(getUserByIdController)
  .patch(authenticate, updateUserController)
  .delete(authenticate, authorize('admin'), deleteUserController);

// Admin-only: update role and/or status
router.patch('/:id/admin', authenticate, authorize('admin'), adminUpdateUserController);

export default router;
