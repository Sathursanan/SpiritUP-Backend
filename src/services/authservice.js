import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import OtpToken from '../models/otptokenmodel.js';
import { signToken } from '../utils/jwtutils.js';
import { generateotp } from '../utils/generateotp.js';
import mailservice from './mailservice.js';
import { ROLES } from '../utils/constants.js';

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const authservice = {
  async registerUser({ name, email, password }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already registered');

    const hash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: ROLES.USER,
    });

    const token = signToken({ id: user._id, role: user.role });
    return { user, token };
  },

  async registerMentor({ name, email, password }) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already registered');

    const hash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: ROLES.MENTOR,
    });
    return user;
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const match = await comparePassword(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const token = signToken({ id: user._id, role: user.role });
    return { user, token };
  },

  async createOtp(email) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No account with that email');

    const otp = generateotp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await OtpToken.create({ email, otp, expiresAt });

    await mailservice.sendOtpEmail(email, otp);
  },

  async resetPassword({ email, otp, newPassword }) {
    const record = await OtpToken.findOne({ email, otp, used: false });
    if (!record) throw new Error('Invalid OTP');

    if (record.expiresAt < new Date()) throw new Error('OTP expired');

    const hash = await hashPassword(newPassword);
    await User.findOneAndUpdate({ email }, { password: hash });

    record.used = true;
    await record.save();
  },
};

export default authservice;
