import { Router } from 'express';
import aicontroller from '../controllers/aicontroller.js';
import { authmiddleware, requireUser, requireAdmin } from '../middlewares/authmiddleware.js';

const router = Router();

// User AI history
router.post('/sessions', authmiddleware, requireUser, aicontroller.createSession);
router.post('/messages', authmiddleware, requireUser, aicontroller.addMessage);
router.get('/sessions', authmiddleware, requireUser, aicontroller.mySessions);
router.get('/sessions/:id/messages', authmiddleware, requireUser, aicontroller.getSessionMessages);

export default router;
