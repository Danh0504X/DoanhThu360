import { Router } from 'express';
import { register, login, loginWithGoogle, refreshToken } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', loginWithGoogle);
router.post('/refresh', refreshToken);

export default router;
