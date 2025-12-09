// import Session from '../models/sessionmodel.js';
// import Booking from '../models/bookingmodel.js';
// import paymentservice from '../services/paymentservice.js';

// const bookingcontroller = {
//   async createBooking(req, res, next) {
//     try {
//       const { sessionId } = req.body;

//       const session = await Session.findById(sessionId);
//       if (!session) return res.status(404).json({ message: 'Session not found' });

//       const booking = await Booking.create({
//         user: req.user.id,
//         session: session._id,
//         status: 'PENDING_PAYMENT',
//       });

//       const successUrl = `${process.env.CLIENT_URL}/payment-success`;
//       const cancelUrl = `${process.env.CLIENT_URL}/payment-cancel`;

//       const checkoutSession = await paymentservice.createCheckoutSession({
//         bookingId: booking._id,
//         amount: session.price,
//         currency: 'lkr',
//         successUrl,
//         cancelUrl,
//       });

//       res.json({ url: checkoutSession.url });
//     } catch (err) {
//       next(err);
//     }
//   },

//   async stripeWebhook(req, res, next) {
//     try {
//       const sig = req.headers['stripe-signature'];
//       const payload = req.rawBody; // must set rawBody in server for webhook route

//       const stripe = (await import('../config/stripeconfig.js')).default;
//       const event = stripe.webhooks.constructEvent(
//         payload,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );

//       await paymentservice.handleWebhookEvent(event);

//       res.json({ received: true });
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// export default bookingcontroller;

// src/controllers/bookingcontroller.js
import Session from '../models/sessionmodel.js';
import Booking from '../models/bookingmodel.js';
import paymentservice from '../services/paymentservice.js';
import stripe from '../config/stripeconfig.js';
import Payment from '../models/paymentmodel.js';


const bookingcontroller = {
  async createBooking(req, res, next) {
    try {
      console.log('createBooking - req.user:', req.user);

      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: 'sessionId is required' });
      }

      const sessionDoc = await Session.findById(sessionId);
      if (!sessionDoc) {
        return res.status(404).json({ message: 'Session not found' });
      }

      const booking = await Booking.create({
        user: req.user.id,
        session: sessionDoc._id,
        status: 'PENDING_PAYMENT',
      });

      const successUrl = `${process.env.CLIENT_URL}/payment-success`;
      const cancelUrl = `${process.env.CLIENT_URL}/payment-cancel`;

      const checkoutSession = await paymentservice.createCheckoutSession({
        bookingId: booking._id,
        amount: sessionDoc.price,
        currency: 'lkr',
        successUrl,
        cancelUrl,
      });

      return res.json({ url: checkoutSession.url });
    } catch (err) {
      next(err);
    }
  },

    // ✅ CONFIRM BOOKING AFTER STRIPE PAYMENT (no webhooks)
    async confirmBooking(req, res, next) {
      try {
        const { sessionId } = req.body; // Stripe Checkout Session ID (cs_test_...)
        if (!sessionId) {
          return res.status(400).json({ message: 'sessionId is required' });
        }
  
        // Get session from Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  
        if (checkoutSession.payment_status !== 'paid') {
          return res.status(400).json({ message: 'Payment not completed' });
        }
  
        const bookingId = checkoutSession.metadata?.bookingId;
        if (!bookingId) {
          return res.status(400).json({ message: 'No bookingId in metadata' });
        }
  
        const booking = await Booking.findById(bookingId).populate('session');
        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
  
        if (booking.status === 'PAID') {
          // already confirmed
          return res.json({ message: 'Booking already confirmed', booking });
        }
  
        booking.status = 'PAID';
        await booking.save();
  
        // Create Payment record
        await Payment.create({
          booking: booking._id,
          amount: booking.session.price,
          currency: 'lkr',
          stripePaymentIntentId: checkoutSession.payment_intent,
          status: 'SUCCEEDED',
        });
  
        return res.json({ message: 'Booking confirmed', booking });
      } catch (err) {
        next(err);
      }
    },
  };
  
  export default bookingcontroller;
  