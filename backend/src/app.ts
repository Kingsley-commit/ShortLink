import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/url.routes';
import authRoutes from './routes/authRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', router);
app.use("/api/auth", authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;