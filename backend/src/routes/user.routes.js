import express from 'express';
import {
  adminUpdateUserController,
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from '../controllers/user.controller.js';
import { authenticate, authorize, authorizeSelfOrAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { adminUpdateUserSchema, listUsersQuerySchema } from '../validations/user.validation.js';

const router = express.Router();

// Listing and creating users is an admin-only operation.
router
  .route('/')
  .get(authenticate, authorize('admin'), validate({ query: listUsersQuerySchema }), getUsersController)
  .post(authenticate, authorize('admin'), createUserController);

router
  .route('/:id')
  .get(authenticate, authorizeSelfOrAdmin('id'), getUserByIdController)
  .patch(authenticate, authorizeSelfOrAdmin('id'), updateUserController)
  .delete(authenticate, authorize('admin'), deleteUserController);

// Admin-only: update role and/or status
router.patch(
  '/:id/admin',
  authenticate,
  authorize('admin'),
  validate({ body: adminUpdateUserSchema }),
  adminUpdateUserController,
);

export default router;
