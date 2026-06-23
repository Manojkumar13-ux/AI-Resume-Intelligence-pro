import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};