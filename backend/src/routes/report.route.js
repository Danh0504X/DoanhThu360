import { Router } from 'express';
import { exportRevenueWordController } from '../controllers/report.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { exportRevenueWordQuerySchema } from '../validations/report.validation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/revenue-word',
  validate({ query: exportRevenueWordQuerySchema }),
  exportRevenueWordController,
);

export default router;
