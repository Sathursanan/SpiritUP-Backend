// import { verifyToken } from '../utils/jwtutils.js';
// import { ROLES } from '../utils/constants.js';

// export const authmiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer '))
//     return res.status(401).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; // { id, role }
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// export const requireAdmin = (req, res, next) => {
//   if (!req.user || req.user.role !== ROLES.ADMIN) {
//     return res.status(403).json({ message: 'Admin only' });
//   }
//   next();
// };

// export const requireMentor = (req, res, next) => {
//   if (!req.user || req.user.role !== ROLES.MENTOR) {
//     return res.status(403).json({ message: 'Mentor only' });
//   }
//   next();
// };

// export const requireUser = (req, res, next) => {
//   if (!req.user || req.user.role !== ROLES.USER) {
//     return res.status(403).json({ message: 'User only' });
//   }
//   next();
// };

// src/middlewares/authmiddleware.js
import { verifyToken } from '../utils/jwtutils.js';
import { ROLES } from '../utils/constants.js';

export const authmiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token); // { id, role, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

export const requireMentor = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.MENTOR) {
    return res.status(403).json({ message: 'Mentor only' });
  }
  next();
};

export const requireUser = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.USER) {
    return res.status(403).json({ message: 'User only' });
  }
  next();
};

