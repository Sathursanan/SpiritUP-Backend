import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import { signToken } from '../utils/jwtutils.js';
import { ROLES } from '../utils/constants.js';

const adminauthcontroller = {
  async registerAdmin(req, res, next) {
    try {
      const { name, email, password, secret } = req.body;
      if (secret !== process.env.ADMIN_REGISTER_SECRET) {
        return res.status(403).json({ message: 'Invalid secret' });
      }

      const existing = await User.findOne({ email });
      if (existing) throw new Error('Admin with this email already exists');

      const hash = await bcrypt.hash(password, 10);
      const admin = await User.create({
        name,
        email,
        password: hash,
        role: ROLES.ADMIN,
      });

      const token = signToken({ id: admin._id, role: admin.role });
      res.status(201).json({ admin, token });
    } catch (err) {
      next(err);
    }
  },
  async loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;
  
      console.log('Login email:', email);
      console.log('ROLES.ADMIN:', ROLES.ADMIN);
  
      const admin = await User.findOne({ email, role: ROLES.ADMIN });
      console.log('Found admin:', admin);
  
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials (not found)' });
      }
  
      console.log('Password from request:', password);
      console.log('Password from DB:', admin.password);
  
      const match = await bcrypt.compare(password, admin.password);
      console.log('Password match:', match);
  
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials (password)' });
      }
  
      const token = signToken({ id: admin._id, role: admin.role });
      res.json({ admin, token });
    } catch (err) {
      next(err);
    }
  }
};

export default adminauthcontroller;
