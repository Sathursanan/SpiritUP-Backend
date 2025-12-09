import { Router } from 'express';
import adminauthcontroller from '../controllers/adminauthcontroller.js';

const router = Router();

router.post('/register', adminauthcontroller.registerAdmin);
router.post('/login', adminauthcontroller.loginAdmin);

export default router;
