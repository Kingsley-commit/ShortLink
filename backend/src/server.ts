import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables before anything else

import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
