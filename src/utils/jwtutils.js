import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || '7d' });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
