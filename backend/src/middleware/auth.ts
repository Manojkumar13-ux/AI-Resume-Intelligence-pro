import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

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
      res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    req.user = { ...user, _id: user.id };
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    } else {
      console.error('Auth error:', error);
      res.status(401).json({ 
        success: false,
        message: 'Authentication failed' 
      });
    }
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }
  } catch (error) {
    res.status(403).json({ 
      success: false,
      message: 'Authorization failed' 
    });
  }
};

export const requirePro = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    const isPro = user.subscription?.plan !== 'free' && 
                  (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date());

    if (isPro || user.credits > 0) {
      next();
    } else {
      res.status(403).json({ 
        success: false,
        message: 'Pro subscription required',
        redirect: '/pricing'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error checking subscription' 
    });
  }
};