import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// JWT secret key (should be stored in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable not set! Using default secret - this is not secure for production.');
}

// Generate JWT token
export const generateToken = (userId: string, username: string): string => {
  const payload = {
    userId,
    username,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Middleware to protect routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.', status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token', status: 403 });
  }
};