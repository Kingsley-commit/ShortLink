import { Router } from 'express';
import { signUp, signIn } from '../controllers/authController';

const authRoutes = Router();


authRoutes.post('/signup', signUp);


authRoutes.post('/signin', signIn);

export default authRoutes;