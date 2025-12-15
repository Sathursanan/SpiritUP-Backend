

// // src/routes/bookingroutes.js
// import express, { Router } from 'express';
// import bookingcontroller from '../controllers/bookingcontroller.js';
// import { authmiddleware, requireUser } from '../middlewares/authmiddleware.js';

// const router = Router();

// // ✅ Create booking & Stripe checkout (USER must be logged in)
// router.post('/', authmiddleware, requireUser, bookingcontroller.createBooking);

// // ✅ Webhook route (keep here OR move to server.js – I'll show both)
// router.post(
//   '/stripe/webhook',
//   express.raw({ type: 'application/json' }),
//   bookingcontroller.stripeWebhook
// );

// // src/routes/bookingroutes.js
// import { Router } from 'express';
// import bookingcontroller from '../controllers/bookingcontroller.js';
// import { authmiddleware, requireUser } from '../middlewares/authmiddleware.js';

// const router = Router();

// console.log('bookingroutes - typeof authmiddleware:', typeof authmiddleware);
// console.log('bookingroutes - typeof requireUser:', typeof requireUser);
// console.log(
//   'bookingroutes - typeof bookingcontroller.createBooking:',
//   typeof bookingcontroller?.createBooking
// );

// // Create booking & Stripe checkout (USER must be logged in)
// router.post('/', authmiddleware, requireUser, bookingcontroller.createBooking);

// // ✅ Confirm booking after Stripe redirect (USER must be logged in)
// router.post('/confirm', authmiddleware, requireUser, bookingcontroller.confirmBooking);

// export default router;




// src/routes/bookingroutes.js
import { Router } from "express";
import bookingcontroller from "../controllers/bookingcontroller.js";
import { authmiddleware, requireUser } from "../middlewares/authmiddleware.js";

const router = Router();

console.log("bookingroutes - typeof authmiddleware:", typeof authmiddleware);
console.log("bookingroutes - typeof requireUser:", typeof requireUser);
console.log(
  "bookingroutes - typeof bookingcontroller.createBooking:",
  typeof bookingcontroller?.createBooking
);

// ✅ Create booking & Stripe checkout (user must be logged in)
router.post("/", authmiddleware, requireUser, bookingcontroller.createBooking);

// ✅ Confirm booking after Stripe redirect
// If you get 401/403 after payment, you can temporarily remove authmiddleware/requireUser here.
router.post(
  "/confirm",
  authmiddleware,
  requireUser,
  bookingcontroller.confirmBooking
);

export default router;