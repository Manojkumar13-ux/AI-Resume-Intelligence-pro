import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Removed .js

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
    const authHeader = req.header('Authorization');
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

    // Add user to request with both id and _id for compatibility
    req.user = { 
      ...user, 
      _id: user.id,  // Keep _id for backward compatibility
      id: user.id    // Also keep id
    };
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

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user has admin role
    if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (error) {
    console.error('Admin check error:', error);
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

    // Check if user is Pro
    const isPro = User.isPro ? User.isPro(user) : 
      (user.subscription?.plan !== 'free' && 
       (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date()));

    // Check if user has credits
    const hasCredits = user.credits && user.credits > 0;

    if (isPro || hasCredits) {
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

// Export auth as well for backward compatibility
export const auth = authenticate;