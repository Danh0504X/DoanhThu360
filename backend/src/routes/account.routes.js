import { Router } from 'express';
import {
  changePasswordController,
  getProfileController,
  getRecentActivitiesController,
  sendVerificationCodeController,
  verifyEmailController,
  updateProfileController,
} from '../controllers/account.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfileController);
router.put('/profile', updateProfileController);
router.put('/change-password', changePasswordController);
router.post('/send-verification-code', sendVerificationCodeController);
router.post('/verify-email', verifyEmailController);
router.get('/recent-activities', getRecentActivitiesController);

export default router;
