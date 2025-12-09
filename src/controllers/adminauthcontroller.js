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

      const admin = await User.findOne({ email, role: ROLES.ADMIN });
      if (!admin) throw new Error('Invalid credentials');

      const match = await bcrypt.compare(password, admin.password);
      if (!match) throw new Error('Invalid credentials');

      const token = signToken({ id: admin._id, role: admin.role });
      res.json({ admin, token });
    } catch (err) {
      next(err);
    }
  },
};

export default adminauthcontroller;
