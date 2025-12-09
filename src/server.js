// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import morgan from 'morgan';
// import './config/dbconfig.js';

// import authroutes from './routes/authroutes.js';
// import adminauthroutes from './routes/adminauthroutes.js';
// import adminroutes from './routes/adminroutes.js';
// import userroutes from './routes/userroutes.js';
// import mentorroutes from './routes/mentorroutes.js';
// import bookingroutes from './routes/bookingroutes.js';
// import airoutes from './routes/airoutes.js';
// import errorhandlermiddleware from './middlewares/errorhandlermiddleware.js';

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// // ✅ MOUNT ROUTES WITH /api PREFIX
// app.use('/api/auth', authroutes);
// app.use('/api/admin/auth', adminauthroutes);
// app.use('/api/admin', adminroutes);
// app.use('/api/user', userroutes);
// app.use('/api/mentor', mentorroutes);
// app.use('/api/bookings', bookingroutes);
// app.use('/api/ai', airoutes);

// // ❗ 404 fallback (optional – if you added this)
// app.use((req, res, next) => {
//   return res.status(404).json({ message: 'Route not found' });
// });

// // Error handler (must be last)
// app.use(errorhandlermiddleware);

// const PORT = process.env.PORT || 5000;

// import mongoose from 'mongoose';

// mongoose.connection.once('open', () => {
//   console.log('MongoDB connected');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });

// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import './config/dbconfig.js';

import authroutes from './routes/authroutes.js';
import adminauthroutes from './routes/adminauthroutes.js';
import adminroutes from './routes/adminroutes.js';
import userroutes from './routes/userroutes.js';
import mentorroutes from './routes/mentorroutes.js';
import bookingroutes from './routes/bookingroutes.js';
import airoutes from './routes/airoutes.js';
import errorhandlermiddleware from './middlewares/errorhandlermiddleware.js';

dotenv.config();

const app = express();

// Allow frontend
app.use(cors());

// Parse JSON for normal routes
app.use(express.json());
app.use(morgan('dev'));

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Grow backend running' });
});

// ✅ MOUNT ROUTES WITH /api PREFIX
app.use('/api/auth', authroutes);
app.use('/api/admin/auth', adminauthroutes);
app.use('/api/admin', adminroutes);
app.use('/api/user', userroutes);
app.use('/api/mentor', mentorroutes);
app.use('/api/bookings', bookingroutes); // includes POST / and POST /confirm
app.use('/api/ai', airoutes);

// ❗ 404 fallback (after all routes)
app.use((req, res) => {
  return res.status(404).json({ message: 'Route not found' });
});

// Error handler (must be last)
app.use(errorhandlermiddleware);

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
