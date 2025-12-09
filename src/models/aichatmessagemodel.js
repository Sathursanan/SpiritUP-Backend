import mongoose from 'mongoose';

const aiChatMessageSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'AiChatSession', required: true },
    sender: { type: String, enum: ['USER', 'AI'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('AiChatMessage', aiChatMessageSchema);
