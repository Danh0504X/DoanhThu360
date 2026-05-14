import { Router } from 'express';
import {
  changeBusinessStatusController,
  createBusinessController,
  deleteBusinessController,
  getBusinessByIdController,
  getBusinessesController,
  updateBusinessController,
} from '../controllers/business.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createBusinessSchema,
  listBusinessesQuerySchema,
  updateBusinessSchema,
} from '../validations/business.validation.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .post(validate({ body: createBusinessSchema }), createBusinessController)
  .get(validate({ query: listBusinessesQuerySchema }), getBusinessesController);

router
  .route('/:id')
  .get(getBusinessByIdController)
  .put(validate({ body: updateBusinessSchema }), updateBusinessController)
  .delete(deleteBusinessController);

router.patch('/:id/status', changeBusinessStatusController);

export default router;
