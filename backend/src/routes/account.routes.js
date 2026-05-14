import { Router } from 'express';
import {
  changePasswordController,
  getProfileController,
  getRecentActivitiesController,
  resendVerifyEmailController,
  updateProfileController,
} from '../controllers/account.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfileController);
router.put('/profile', updateProfileController);
router.put('/change-password', changePasswordController);
router.post('/resend-verification-email', resendVerifyEmailController);
router.get('/recent-activities', getRecentActivitiesController);

export default router;
