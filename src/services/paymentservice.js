// import stripe from '../config/stripeconfig.js';
// import Booking from '../models/bookingmodel.js';
// import Payment from '../models/paymentmodel.js';

// const paymentservice = {
//   async createCheckoutSession({ bookingId, amount, currency, successUrl, cancelUrl }) {
//     const session = await stripe.checkout.sessions.create({
//       mode: 'payment',
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency,
//             product_data: { name: 'Mentor Session' },
//             unit_amount: amount * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       metadata: {
//         bookingId: bookingId.toString(),
//       },
//     });

//     await Booking.findByIdAndUpdate(bookingId, { stripeSessionId: session.id });

//     return session;
//   },

//   async handleWebhookEvent(event) {
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       const bookingId = session.metadata.bookingId;

//       const booking = await Booking.findById(bookingId).populate('session');
//       if (!booking) return;

//       booking.status = 'PAID';
//       await booking.save();

//       await Payment.create({
//         booking: booking._id,
//         amount: booking.session.price,
//         currency: 'lkr',
//         stripePaymentIntentId: session.payment_intent,
//         status: 'SUCCEEDED',
//       });
//     }
//   },
// };

// export default paymentservice;


// // src/services/paymentservice.js
// import stripe from '../config/stripeconfig.js';
// import Booking from '../models/bookingmodel.js';
// import Payment from '../models/paymentmodel.js';

// const paymentservice = {
//   async createCheckoutSession({ bookingId, amount, currency, successUrl, cancelUrl }) {
//     const session = await stripe.checkout.sessions.create({
//       mode: 'payment',
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency,
//             product_data: { name: 'Mentor Session' },
//             unit_amount: amount * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       // IMPORTANT: include {CHECKOUT_SESSION_ID} in success URL
//       success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: cancelUrl,
//       metadata: {
//         bookingId: bookingId.toString(),
//       },
//     });

//     // Optional: store stripeSessionId if you want
//     await Booking.findByIdAndUpdate(bookingId, { stripeSessionId: session.id });

//     return session;
//   },

//   // We keep this for future (if you later want webhooks), but not required for confirm flow
//   async handleWebhookEvent(event) {
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       const bookingId = session.metadata?.bookingId;
//       console.log('✅ checkout.session.completed for bookingId:', bookingId);

//       if (!bookingId) return;

//       const booking = await Booking.findById(bookingId).populate('session');
//       if (!booking) return;

//       booking.status = 'PAID';
//       await booking.save();

//       await Payment.create({
//         booking: booking._id,
//         amount: booking.session.price,
//         currency: 'lkr',
//         stripePaymentIntentId: session.payment_intent,
//         status: 'SUCCEEDED',
//       });
//     }
//   },
// };

// export default paymentservice;


// src/services/paymentservice.js
import stripe from "../config/stripeconfig.js";
import Booking from "../models/bookingmodel.js";
import Payment from "../models/paymentmodel.js";

const paymentservice = {
  async createCheckoutSession({
    bookingId,
    amount,
    currency,
    successUrl,
    cancelUrl,
  }) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Mentor Session" },
            unit_amount: Math.round(amount * 100), // convert to smallest unit
          },
          quantity: 1,
        },
      ],
      // ✅ IMPORTANT: must include {CHECKOUT_SESSION_ID} and use backticks
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: bookingId.toString(),
      },
    });

    // Optional: store stripeSessionId
    await Booking.findByIdAndUpdate(bookingId, { stripeSessionId: session.id });

    return session;
  },

  // Optional: for future webhooks if you use them later
  async handleWebhookEvent(event) {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      console.log("✅ checkout.session.completed for bookingId:", bookingId);

      if (!bookingId) return;

      const booking = await Booking.findById(bookingId).populate("session");
      if (!booking) return;

      booking.status = "PAID";
      await booking.save();

      await Payment.create({
        booking: booking._id,
        amount: booking.session.price,
        currency: "lkr",
        stripePaymentIntentId: session.payment_intent,
        status: "SUCCEEDED",
      });
    }
  },
};

export default paymentservice;