import { Router } from 'express';
import mentorcontroller from '../controllers/mentorcontroller.js';
import { authmiddleware, requireMentor } from '../middlewares/authmiddleware.js';

const router = Router();

router.use(authmiddleware, requireMentor);

router.get('/profile', mentorcontroller.getProfile);
router.put('/profile', mentorcontroller.updateProfile);
router.post('/sessions', mentorcontroller.createSession);
router.get('/sessions', mentorcontroller.mySessions);
router.get('/bookings', mentorcontroller.myBookings);

export default router;
