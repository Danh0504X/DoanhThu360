import { Router } from 'express';
import {
  createRevenueEntryController,
  deleteRevenueEntryController,
  getRevenueDailyChartController,
  getRevenueEntriesController,
  getRevenueEntryByIdController,
  getRevenueSummaryController,
  updateRevenueEntryController,
} from '../controllers/revenueEntry.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createRevenueEntrySchema,
  listRevenueEntriesQuerySchema,
  revenueSummaryQuerySchema,
  updateRevenueEntrySchema,
} from '../validations/revenueEntry.validation.js';

const router = Router();

router.use(authenticate);

router.get('/summary', validate({ query: revenueSummaryQuerySchema }), getRevenueSummaryController);
router.get(
  '/chart/daily',
  validate({ query: revenueSummaryQuerySchema }),
  getRevenueDailyChartController,
);

router
  .route('/')
  .post(validate({ body: createRevenueEntrySchema }), createRevenueEntryController)
  .get(validate({ query: listRevenueEntriesQuerySchema }), getRevenueEntriesController);

router
  .route('/:id')
  .get(getRevenueEntryByIdController)
  .put(validate({ body: updateRevenueEntrySchema }), updateRevenueEntryController)
  .delete(deleteRevenueEntryController);

export default router;
