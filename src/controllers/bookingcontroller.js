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

// // src/controllers/bookingcontroller.js
// import Session from '../models/sessionmodel.js';
// import Booking from '../models/bookingmodel.js';
// import paymentservice from '../services/paymentservice.js';
// import stripe from '../config/stripeconfig.js';
// import Payment from '../models/paymentmodel.js';


// const bookingcontroller = {
//   async createBooking(req, res, next) {
//     try {
//       console.log('createBooking - req.user:', req.user);

//       const { sessionId } = req.body;
//       if (!sessionId) {
//         return res.status(400).json({ message: 'sessionId is required' });
//       }

//       const sessionDoc = await Session.findById(sessionId);
//       if (!sessionDoc) {
//         return res.status(404).json({ message: 'Session not found' });
//       }

//       const booking = await Booking.create({
//         user: req.user.id,
//         session: sessionDoc._id,
//         status: 'PENDING_PAYMENT',
//       });

//       const successUrl = `${process.env.CLIENT_URL}/payment-success`;
//       const cancelUrl = `${process.env.CLIENT_URL}/payment-cancel`;

//       const checkoutSession = await paymentservice.createCheckoutSession({
//         bookingId: booking._id,
//         amount: sessionDoc.price,
//         currency: 'lkr',
//         successUrl,
//         cancelUrl,
//       });

//       return res.json({ url: checkoutSession.url });
//     } catch (err) {
//       next(err);
//     }
//   },

//     // ✅ CONFIRM BOOKING AFTER STRIPE PAYMENT (no webhooks)
//     async confirmBooking(req, res, next) {
//       try {
//         const { sessionId } = req.body; // Stripe Checkout Session ID (cs_test_...)
//         if (!sessionId) {
//           return res.status(400).json({ message: 'sessionId is required' });
//         }
  
//         // Get session from Stripe
//         const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  
//         if (checkoutSession.payment_status !== 'paid') {
//           return res.status(400).json({ message: 'Payment not completed' });
//         }
  
//         const bookingId = checkoutSession.metadata?.bookingId;
//         if (!bookingId) {
//           return res.status(400).json({ message: 'No bookingId in metadata' });
//         }
  
//         const booking = await Booking.findById(bookingId).populate('session');
//         if (!booking) {
//           return res.status(404).json({ message: 'Booking not found' });
//         }
  
//         if (booking.status === 'PAID') {
//           // already confirmed
//           return res.json({ message: 'Booking already confirmed', booking });
//         }
  
//         booking.status = 'PAID';
//         await booking.save();
  
//         // Create Payment record
//         await Payment.create({
//           booking: booking._id,
//           amount: booking.session.price,
//           currency: 'lkr',
//           stripePaymentIntentId: checkoutSession.payment_intent,
//           status: 'SUCCEEDED',
//         });
  
//         return res.json({ message: 'Booking confirmed', booking });
//       } catch (err) {
//         next(err);
//       }
//     },
//   };
  
//   export default bookingcontroller;
  



// // src/controllers/bookingcontroller.js
// import Session from "../models/sessionmodel.js";
// import Booking from "../models/bookingmodel.js";
// import paymentservice from "../services/paymentservice.js"; // ✅ backend stripe service
// import stripe from "../config/stripeconfig.js";
// import Payment from "../models/paymentmodel.js";

// const bookingcontroller = {
//   // Create booking & Stripe checkout
//   async createBooking(req, res, next) {
//     try {
//       console.log("📦 createBooking - req.user:", req.user);

//       const { sessionId } = req.body;
//       if (!sessionId) {
//         return res.status(400).json({ message: "sessionId is required" });
//       }

//       const sessionDoc = await Session.findById(sessionId);
//       if (!sessionDoc) {
//         return res.status(404).json({ message: "Session not found" });
//       }

//       const booking = await Booking.create({
//         user: req.user.id,
//         session: sessionDoc._id,
//         status: "PENDING_PAYMENT",
//       });

//       const successUrl = `${process.env.CLIENT_URL}/payment-success`;
//       const cancelUrl = `${process.env.CLIENT_URL}/payment-cancel`;

//       const checkoutSession = await paymentservice.createCheckoutSession({
//         bookingId: booking._id,
//         amount: sessionDoc.price,
//         currency: "lkr",
//         successUrl,
//         cancelUrl,
//       });

//       console.log("✅ Stripe checkout session created:", checkoutSession.id);

//       return res.json({ url: checkoutSession.url });
//     } catch (err) {
//       console.error("❌ Error in createBooking:", err);
//       next(err);
//     }
//   },

//   // ✅ CONFIRM BOOKING AFTER STRIPE PAYMENT (no webhooks)
//   async confirmBooking(req, res, next) {
//     try {
//       const { sessionId } = req.body; // Stripe Checkout Session ID (cs_test_...)
//       console.log("🔁 /api/bookings/confirm called, sessionId =", sessionId);

//       if (!sessionId) {
//         return res.status(400).json({ message: "sessionId is required" });
//       }

//       // Get session from Stripe
//       const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

//       console.log("✅ Stripe session retrieved:", {
//         id: checkoutSession.id,
//         status: checkoutSession.status,
//         payment_status: checkoutSession.payment_status,
//         amount_total: checkoutSession.amount_total,
//         currency: checkoutSession.currency,
//         metadata: checkoutSession.metadata,
//       });

//       // Stripe must say payment is completed
//       if (checkoutSession.payment_status !== "paid") {
//         return res.status(400).json({
//           message: "Payment not completed",
//           payment_status: checkoutSession.payment_status,
//         });
//       }

//       const bookingId = checkoutSession.metadata?.bookingId;
//       console.log("🔎 Booking ID from Stripe metadata:", bookingId);

//       if (!bookingId) {
//         return res.status(400).json({ message: "No bookingId in metadata" });
//       }

//       const booking = await Booking.findById(bookingId).populate("session");
//       if (!booking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }

//       // Already confirmed → just return the booking
//       if (booking.status === "PAID") {
//         console.log("ℹ️ Booking already marked as PAID");
//         return res.json({ message: "Booking already confirmed", booking });
//       }

//       // Mark booking as paid
//       booking.status = "PAID";
//       await booking.save();

//       // Create payment record
//       await Payment.create({
//         booking: booking._id,
//         amount: booking.session.price,
//         currency: "lkr",
//         stripePaymentIntentId: checkoutSession.payment_intent,
//         status: "SUCCEEDED",
//       });

//       console.log("💰 Booking confirmed and payment record created");

//       return res.json({ message: "Booking confirmed", booking });
//     } catch (err) {
//       console.error("❌ Error in confirmBooking:", err);
//       next(err);
//     }
//   },
// };

// export default bookingcontroller;



// // src/controllers/bookingcontroller.js
// import Session from "../models/sessionmodel.js";
// import Booking from "../models/bookingmodel.js";
// import paymentservice from "../services/paymentservice.js";
// import stripe from "../config/stripeconfig.js";
// import Payment from "../models/paymentmodel.js";

// const bookingcontroller = {
//   async createBooking(req, res, next) {
//     try {
//       console.log("📦 createBooking - req.user:", req.user);

//       const { sessionId } = req.body;
//       if (!sessionId) {
//         return res.status(400).json({ message: "sessionId is required" });
//       }

//       // ⬇️ only allow sessions that are OPEN (not BOOKED/CANCELLED)
//       const sessionDoc = await Session.findOne({ _id: sessionId, status: 'OPEN' });
//       if (!sessionDoc) {
//         return res
//           .status(404)
//           .json({ message: "Session not available or already booked" });
//       }

//       const booking = await Booking.create({
//         user: req.user.id,
//         session: sessionDoc._id,
//         status: "PENDING_PAYMENT",
//       });

//       const successUrl = `${process.env.CLIENT_URL}/payment-success`;
//       const cancelUrl = `${process.env.CLIENT_URL}/payment-cancel`;

//       const checkoutSession = await paymentservice.createCheckoutSession({
//         bookingId: booking._id,
//         amount: sessionDoc.price,
//         currency: "lkr",
//         successUrl,
//         cancelUrl,
//       });

//       console.log("✅ Stripe checkout session created:", checkoutSession.id);

//       return res.json({ url: checkoutSession.url });
//     } catch (err) {
//       console.error("❌ Error in createBooking:", err);
//       next(err);
//     }
//   },
//   async confirmBooking(req, res, next) {
//     try {
//       const { sessionId } = req.body; // Stripe Checkout Session ID (cs_...)
//       console.log("🔁 /api/bookings/confirm called, sessionId =", sessionId);

//       if (!sessionId) {
//         return res.status(400).json({ message: "sessionId is required" });
//       }

//       const checkoutSession = await stripe.checkout.sessions.retrieve(
//         sessionId
//       );

//       console.log("✅ Stripe session retrieved:", {
//         id: checkoutSession.id,
//         status: checkoutSession.status,
//         payment_status: checkoutSession.payment_status,
//         amount_total: checkoutSession.amount_total,
//         currency: checkoutSession.currency,
//         metadata: checkoutSession.metadata,
//       });

//       if (checkoutSession.payment_status !== "paid") {
//         return res.status(400).json({
//           message: "Payment not completed",
//           payment_status: checkoutSession.payment_status,
//         });
//       }

//       const bookingId = checkoutSession.metadata?.bookingId;
//       console.log("🔎 Booking ID from Stripe metadata:", bookingId);

//       if (!bookingId) {
//         return res.status(400).json({ message: "No bookingId in metadata" });
//       }

//       const booking = await Booking.findById(bookingId).populate("session");
//       if (!booking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }

//       // if already paid, just return
//       if (booking.status === "PAID") {
//         console.log("ℹ️ Booking already marked as PAID");
//         return res.json({ message: "Booking already confirmed", booking });
//       }

//       // 1️⃣ Mark booking as paid
//       booking.status = "PAID";
//       await booking.save();

//       // 2️⃣ Mark the session as BOOKED (no one else can book it)
//       await Session.findByIdAndUpdate(booking.session._id, {
//         status: "BOOKED",
//       });

//       // 3️⃣ Create payment record
//       await Payment.create({
//         booking: booking._id,
//         amount: booking.session.price,
//         currency: "lkr",
//         stripePaymentIntentId: checkoutSession.payment_intent,
//         status: "SUCCEEDED",
//       });

//       console.log("💰 Booking confirmed, session marked BOOKED, payment record created");

//       return res.json({ message: "Booking confirmed", booking });
//     } catch (err) {
//       console.error("❌ Error in confirmBooking:", err);
//       next(err);
//     }
//   },
// };

// export default bookingcontroller;






// src/controllers/bookingcontroller.js
import Session from "../models/sessionmodel.js";
import Booking from "../models/bookingmodel.js";
import paymentservice from "../services/paymentservice.js";
import stripe from "../config/stripeconfig.js";
import Payment from "../models/paymentmodel.js";
import mailservice from "../services/mailservice.js";

const bookingcontroller = {
  async createBooking(req, res, next) {
    try {
      console.log("📦 createBooking - req.user:", req.user);

      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "sessionId is required" });
      }

      // only allow sessions that are OPEN (not BOOKED/CANCELLED)
      const sessionDoc = await Session.findOne({ _id: sessionId, status: 'OPEN' });
      if (!sessionDoc) {
        return res
          .status(404)
          .json({ message: "Session not available or already booked" });
      }

      const booking = await Booking.create({
        user: req.user.id,
        session: sessionDoc._id,
        status: "PENDING_PAYMENT",
      });

      const successUrl = `${process.env.CLIENT_URL}/payment-success`;
      const cancelUrl = `${process.env.CLIENT_URL}/payment-cancel`;

      const checkoutSession = await paymentservice.createCheckoutSession({
        bookingId: booking._id,
        amount: sessionDoc.price,
        currency: "lkr",
        successUrl,
        cancelUrl,
      });

      console.log("✅ Stripe checkout session created:", checkoutSession.id);

      return res.json({ url: checkoutSession.url });
    } catch (err) {
      console.error("❌ Error in createBooking:", err);
      next(err);
    }
  },

  async confirmBooking(req, res, next) {
    try {
      const { sessionId } = req.body; // Stripe Checkout Session ID (cs_...)
      console.log("🔁 /api/bookings/confirm called, sessionId =", sessionId);

      if (!sessionId) {
        return res.status(400).json({ message: "sessionId is required" });
      }

      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId
      );

      console.log("✅ Stripe session retrieved:", {
        id: checkoutSession.id,
        status: checkoutSession.status,
        payment_status: checkoutSession.payment_status,
        amount_total: checkoutSession.amount_total,
        currency: checkoutSession.currency,
        metadata: checkoutSession.metadata,
      });

      if (checkoutSession.payment_status !== "paid") {
        return res.status(400).json({
          message: "Payment not completed",
          payment_status: checkoutSession.payment_status,
        });
      }

      const bookingId = checkoutSession.metadata?.bookingId;
      console.log("🔎 Booking ID from Stripe metadata:", bookingId);

      if (!bookingId) {
        return res.status(400).json({ message: "No bookingId in metadata" });
      }

      // populate session + mentor + user so we can email them
      const booking = await Booking.findById(bookingId)
        .populate({
          path: "session",
          populate: { path: "mentor", select: "name email" },
        })
        .populate("user", "name email");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // if already paid, just return
      if (booking.status === "PAID") {
        console.log("ℹ️ Booking already marked as PAID");
        return res.json({ message: "Booking already confirmed", booking });
      }

      // 1️⃣ Mark booking as paid
      booking.status = "PAID";
      await booking.save();

      // 2️⃣ Mark the session as BOOKED (no one else can book it)
      await Session.findByIdAndUpdate(booking.session._id, {
        status: "BOOKED",
      });

      // 3️⃣ Create payment record
      await Payment.create({
        booking: booking._id,
        amount: booking.session.price,
        currency: "lkr",
        stripePaymentIntentId: checkoutSession.payment_intent,
        status: "SUCCEEDED",
      });

      console.log("💰 Booking confirmed, session marked BOOKED, payment record created");

      // 4️⃣ Send emails to mentor & user (do not fail the request if email fails)
      const session = booking.session;
      const mentor = booking.session.mentor;
      const user = booking.user;

      if (mentor && user) {
        mailservice
          .sendSessionBookedEmails({
            mentorEmail: mentor.email,
            mentorName: mentor.name,
            userEmail: user.email,
            userName: user.name,
            sessionTitle: session.title,
            sessionStartTime: session.startTime,
            durationMinutes: session.durationMinutes,
            price: session.price,
          })
          .catch((err) =>
            console.error("Failed to send session booked emails:", err)
          );
      }

      return res.json({ message: "Booking confirmed", booking });
    } catch (err) {
      console.error("❌ Error in confirmBooking:", err);
      next(err);
    }
  },
};

export default bookingcontroller;