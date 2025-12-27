import { body } from 'express-validator';

// Reusable email + password rules
const emailRule = body('email')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Email is not valid')
  .normalizeEmail();

const passwordRule = body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters');

export const registerUserValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  emailRule,
  passwordRule,
];

export const registerMentorValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  emailRule,
  passwordRule,
];

export const loginValidator = [
  emailRule,
  passwordRule,
];

export const forgotPasswordValidator = [
  emailRule,
];

export const resetPasswordValidator = [
  emailRule,
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 4, max: 10 }).withMessage('OTP length is invalid'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];