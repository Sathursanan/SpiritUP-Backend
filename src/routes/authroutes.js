// import { Router } from 'express';
// import authcontroller from '../controllers/authcontroller.js';

// const router = Router();

// // POST /api/auth/register/user
// router.post('/register/user', authcontroller.registerUser);

// // POST /api/auth/register/mentor
// router.post('/register/mentor', authcontroller.registerMentor);

// // POST /api/auth/login
// router.post('/login', authcontroller.login);

// // POST /api/auth/forgot-password
// router.post('/forgot-password', authcontroller.forgotPassword);

// // POST /api/auth/reset-password
// router.post('/reset-password', authcontroller.resetPassword);

// export default router;








import { Router } from 'express';
import authcontroller from '../controllers/authcontroller.js';
import validateRequest from '../middlewares/validateRequest.js';
import {
  registerUserValidator,
  registerMentorValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authvalidators.js';

const router = Router();

/// authRoutes.js
router.post(
    "/register/user",
    registerUserValidator,
    validateRequest,          // ✅ add here (after validator)
    authcontroller.registerUser
  );
  
  router.post(
    "/register/mentor",
    registerMentorValidator,
    validateRequest,          // ✅ add here (after validator)
    authcontroller.registerMentor
  );
  

// POST /api/auth/login
router.post(
  '/login',
  loginValidator,
  validateRequest,
  authcontroller.login
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  authcontroller.forgotPassword
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  resetPasswordValidator,
  validateRequest,
  authcontroller.resetPassword
);

export default router;