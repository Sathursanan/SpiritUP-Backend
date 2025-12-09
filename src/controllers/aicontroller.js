import AiChatSession from '../models/aichatsessionmodel.js';
import AiChatMessage from '../models/aichatmessagemodel.js';

const aicontroller = {
  async createSession(req, res, next) {
    try {
      const { title } = req.body;
      const session = await AiChatSession.create({
        user: req.user.id,
        title: title || 'AI Chat',
      });
      res.status(201).json(session);
    } catch (err) {
      next(err);
    }
  },

  async addMessage(req, res, next) {
    try {
      const { sessionId, sender, content } = req.body;
      const message = await AiChatMessage.create({
        session: sessionId,
        sender,
        content,
      });
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  },

  async mySessions(req, res, next) {
    try {
      const sessions = await AiChatSession.find({ user: req.user.id }).sort({ updatedAt: -1 });
      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },

  async getSessionMessages(req, res, next) {
    try {
      const { id } = req.params;
      const messages = await AiChatMessage.find({ session: id }).sort({ createdAt: 1 });
      res.json(messages);
    } catch (err) {
      next(err);
    }
  },
};

export default aicontroller;
