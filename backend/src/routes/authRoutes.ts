import { Router } from 'express';
import { signUp, signIn } from '../controllers/authController';

const authRoutes = Router();

// POST /api/auth/signup
authRoutes.post('/signup', signUp);

// POST /api/auth/signin
authRoutes.post('/signin', signIn);

export default authRoutes;