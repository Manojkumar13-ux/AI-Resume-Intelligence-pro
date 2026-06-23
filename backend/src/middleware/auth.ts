import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// This properly extends Express Request
export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use req.get() or req.headers directly
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = { ...user, _id: user.id, id: user.id };
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Authentication failed' });
    }
  }
};

// Export as auth for convenience
export const auth = authenticate;

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (error) {
    res.status(403).json({ message: 'Authorization failed' });
  }
};

export const requirePro = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const isPro = user.subscription?.plan !== 'free' && 
                  (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date());

    if (isPro || (user.credits && user.credits > 0)) {
      next();
    } else {
      res.status(403).json({ 
        message: 'Pro subscription required',
        redirect: '/pricing'
      });
    }
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ message: 'Error checking subscription' });
  }
};