// import mongoose from 'mongoose';

// const aiChatSessionSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     title: { type: String, default: 'AI Chat' },
//   },
//   { timestamps: true }
// );

// export default mongoose.model('AiChatSession', aiChatSessionSchema);


// src/models/aichatsessionmodel.js
import mongoose from 'mongoose';

const aiChatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'AI Chat',
    },
  },
  { timestamps: true }
);

export default mongoose.model('AiChatSession', aiChatSessionSchema);