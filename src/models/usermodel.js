import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['USER', 'MENTOR', 'ADMIN'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'BLOCKED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
