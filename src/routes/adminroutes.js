import { Router } from 'express';
import admincontroller from '../controllers/admincontroller.js';
import { authmiddleware, requireAdmin } from '../middlewares/authmiddleware.js';

const router = Router();

router.use(authmiddleware, requireAdmin);

router.get('/overview', admincontroller.overview);
router.get('/mentors', admincontroller.listMentors);
router.patch('/mentors/:id/approve', admincontroller.approveMentor);
router.delete('/mentors/:id', admincontroller.deleteMentor);
router.get('/users', admincontroller.listUsers);

export default router;
