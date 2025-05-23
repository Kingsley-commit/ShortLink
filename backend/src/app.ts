import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/url.routes';
import authRoutes from './routes/authRoutes';
import urlController from './controllers/url.controller';

const app = express();


app.use(cors());
app.use(bodyParser.json());


app.use('/api', router);
app.use("/api/auth", authRoutes)

router.get('/', (req, res) => {
  res.redirect('https://get.shortlnk.live'); 
});


app.get('/:shortCode', (req, res) => {
  urlController.redirect(req, res);
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;