import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    price: { type: Number, required: true }, // LKR
    status: {
      type: String,
      enum: ['OPEN', 'CANCELLED'],
      default: 'OPEN',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);
