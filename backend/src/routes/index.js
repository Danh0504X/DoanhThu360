import express from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import businessRoutes from './business.routes.js';
import revenueEntryRoutes from './revenueEntry.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
  });
});

router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/revenue-entries', revenueEntryRoutes);
router.use('/users', userRoutes);

export default router;
