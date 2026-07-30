import { Router } from 'express';
import {
  register,
  login,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
  refreshToken,
  getMe,
  logout,
  getRegistrationStatus,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/registration-status', getRegistrationStatus);
router.post('/register', register);
router.post('/login', login);
router.post('/google', loginWithGoogle);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
