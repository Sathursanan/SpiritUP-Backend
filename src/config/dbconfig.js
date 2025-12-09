import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, {
    dbName: 'grow',
  })
  .then(() => console.log('DB connection success'))
  .catch((err) => {
    console.error('DB connection error', err);
    process.exit(1);
  });
