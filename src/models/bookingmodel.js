import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'PAID', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING_PAYMENT',
    },
    stripeSessionId: String,
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
