import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: ACCESS_EXPIRES 
  });

  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: REFRESH_EXPIRES 
  });

  return { accessToken, refreshToken };
};