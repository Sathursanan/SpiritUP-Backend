import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: String,
    expertise: [String],
    priceDefault: { type: Number, default: 0 }, // LKR
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DELETED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export default mongoose.model('MentorProfile', mentorProfileSchema);
