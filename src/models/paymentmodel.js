import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'lkr' },
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ['SUCCEEDED', 'FAILED'],
      default: 'SUCCEEDED',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
