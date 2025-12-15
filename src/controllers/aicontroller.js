// import AiChatSession from '../models/aichatsessionmodel.js';
// import AiChatMessage from '../models/aichatmessagemodel.js';

// const aicontroller = {
//   async createSession(req, res, next) {
//     try {
//       const { title } = req.body;
//       const session = await AiChatSession.create({
//         user: req.user.id,
//         title: title || 'AI Chat',
//       });
//       res.status(201).json(session);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async addMessage(req, res, next) {
//     try {
//       const { sessionId, sender, content } = req.body;
//       const message = await AiChatMessage.create({
//         session: sessionId,
//         sender,
//         content,
//       });
//       res.status(201).json(message);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async mySessions(req, res, next) {
//     try {
//       const sessions = await AiChatSession.find({ user: req.user.id }).sort({ updatedAt: -1 });
//       res.json(sessions);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getSessionMessages(req, res, next) {
//     try {
//       const { id } = req.params;
//       const messages = await AiChatMessage.find({ session: id }).sort({ createdAt: 1 });
//       res.json(messages);
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// export default aicontroller;







// src/controllers/aicontroller.js
import AiChatSession from '../models/aichatsessionmodel.js';
import AiChatMessage from '../models/aichatmessagemodel.js';
import { ROLES } from '../utils/constants.js';

const aicontroller = {
  // USER: create a new AI chat session for the logged-in user
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

  // USER (or later ADMIN): add a message to a session
  async addMessage(req, res, next) {
    try {
      const { sessionId, sender, content } = req.body;

      if (!sessionId || !sender || !content) {
        return res
          .status(400)
          .json({ message: 'sessionId, sender, and content are required' });
      }

      const session = await AiChatSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // If normal user, make sure they own this session
      if (
        req.user.role === ROLES.USER &&
        session.user.toString() !== req.user.id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'Not allowed to add messages to this session' });
      }

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

  // USER: get all of *my* sessions
  async mySessions(req, res, next) {
    try {
      const sessions = await AiChatSession.find({ user: req.user.id })
        .sort({ updatedAt: -1 });

      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },

  // USER: get messages for a session I own
  // ADMIN: get messages for any session
  async getSessionMessages(req, res, next) {
    try {
      const { id } = req.params; // session id

      const session = await AiChatSession.findById(id);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // If it's a normal user, ensure they own the session
      if (
        req.user.role === ROLES.USER &&
        session.user.toString() !== req.user.id.toString()
      ) {
        return res
          .status(403)
          .json({ message: 'Not allowed to view this session' });
      }

      // If ADMIN, allowed to see any session

      const messages = await AiChatMessage.find({ session: id })
        .sort({ createdAt: 1 });

      res.json(messages);
    } catch (err) {
      next(err);
    }
  },

  // ADMIN: get all AI chat sessions (with user info)
  async adminAllSessions(req, res, next) {
    try {
      const sessions = await AiChatSession.find()
        .populate('user', 'name email role')
        .sort({ updatedAt: -1 });

      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },

  // ADMIN: get all sessions for a specific user
  async adminUserSessions(req, res, next) {
    try {
      const { userId } = req.params;

      const sessions = await AiChatSession.find({ user: userId })
        .populate('user', 'name email role')
        .sort({ updatedAt: -1 });

      res.json(sessions);
    } catch (err) {
      next(err);
    }
  },
};

export default aicontroller;