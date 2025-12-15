// import { Router } from 'express';
// import aicontroller from '../controllers/aicontroller.js';
// import { authmiddleware, requireUser, requireAdmin } from '../middlewares/authmiddleware.js';

// const router = Router();

// // User AI history
// router.post('/sessions', authmiddleware, requireUser, aicontroller.createSession);
// router.post('/messages', authmiddleware, requireUser, aicontroller.addMessage);
// router.get('/sessions', authmiddleware, requireUser, aicontroller.mySessions);
// router.get('/sessions/:id/messages', authmiddleware, requireUser, aicontroller.getSessionMessages);

// export default router;


// src/routes/aichatroutes.js
import { Router } from 'express';
import aicontroller from '../controllers/aicontroller.js';
import {
  authmiddleware,
  requireUser,
  requireAdmin,
} from '../middlewares/authmiddleware.js';

const router = Router();

// ---------- USER ROUTES (need user token) ----------

// Create a new AI chat session
router.post(
  '/sessions',
  authmiddleware,
  requireUser,
  aicontroller.createSession
);

// Add a message to a session
router.post(
  '/messages',
  authmiddleware,
  requireUser,
  aicontroller.addMessage
);

// Get all my sessions
router.get(
  '/sessions',
  authmiddleware,
  requireUser,
  aicontroller.mySessions
);

// Get messages for one of my sessions
router.get(
  '/sessions/:id/messages',
  authmiddleware,
  requireUser,
  aicontroller.getSessionMessages
);

// ---------- ADMIN ROUTES (need admin token) ----------

// Admin: get all AI chat sessions
router.get(
  '/admin/sessions',
  authmiddleware,
  requireAdmin,
  aicontroller.adminAllSessions
);

// Admin: get sessions for a specific user
router.get(
  '/admin/users/:userId/sessions',
  authmiddleware,
  requireAdmin,
  aicontroller.adminUserSessions
);

// Admin: get messages for any session
router.get(
  '/admin/sessions/:id/messages',
  authmiddleware,
  requireAdmin,
  aicontroller.getSessionMessages
);

export default router;