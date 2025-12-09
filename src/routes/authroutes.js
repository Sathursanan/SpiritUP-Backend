import { Router } from 'express';
import authcontroller from '../controllers/authcontroller.js';

const router = Router();

// POST /api/auth/register/user
router.post('/register/user', authcontroller.registerUser);

// POST /api/auth/register/mentor
router.post('/register/mentor', authcontroller.registerMentor);

// POST /api/auth/login
router.post('/login', authcontroller.login);

// POST /api/auth/forgot-password
router.post('/forgot-password', authcontroller.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authcontroller.resetPassword);

export default router;
