import { Router } from 'express';
import usercontroller from '../controllers/usercontroller.js';
import { authmiddleware, requireUser } from '../middlewares/authmiddleware.js';

const router = Router();

router.use(authmiddleware, requireUser);

router.get('/me', usercontroller.me);
router.get('/bookings', usercontroller.myBookings);
router.get('/sessions', usercontroller.listSessions);


export default router;
