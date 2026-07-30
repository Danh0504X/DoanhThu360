import { Router } from 'express';
import {
  getDashboardStatsController,
  getSettingsController,
  updateSettingsController,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Everything under /admin requires an authenticated admin.
router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStatsController);
router.route('/settings')
  .get(getSettingsController)
  .patch(updateSettingsController);

export default router;
