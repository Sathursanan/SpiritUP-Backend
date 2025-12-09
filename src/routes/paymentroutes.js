// src/routes/paymentroutes.js
import express from 'express';
import { stripeWebhook } from '../controllers/paymentcontroller.js';

const router = express.Router();

// For real production Stripe webhooks, you should use express.raw() and signature verification
router.post('/webhook', express.json({ type: '*/*' }), stripeWebhook);

export default router;
