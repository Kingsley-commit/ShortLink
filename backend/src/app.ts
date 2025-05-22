import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/url.routes';
import authRoutes from './routes/authRoutes';

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.use('/api', router);
app.use("/api/auth", authRoutes)


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;