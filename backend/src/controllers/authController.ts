import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

const validateEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    console.log('📝 Register attempt:', { email, name });

    if (!email || !password || !name) {
      res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ 
        success: false,
        message: 'Invalid email format' 
      });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ 
        success: false,
        message: 'User already exists' 
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      credits: 3,
      role: 'user',
      subscription: {
        plan: 'free',
        expiresAt: null
      },
      lastLogin: new Date()
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        role: user.role,
        subscription: user.subscription,
        isPro: User.isPro(user)
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: String(error)
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Login attempt:', { email });

    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
      return;
    }

    user.lastLogin = new Date();
    await User.findByIdAndUpdate(user.id!, { lastLogin: user.lastLogin });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        role: user.role,
        subscription: user.subscription,
        isPro: User.isPro(user)
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: String(error)
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    res.json({
      success: true,
      user: {
        ...user,
        isPro: User.isPro(user),
        creditsRemaining: User.creditsRemaining(user)
      }
    });
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const updates: any = {};

    if (name) updates.name = name.trim();
    if (email) {
      if (!validateEmail(email)) {
        res.status(400).json({ 
          success: false,
          message: 'Invalid email format' 
        });
        return;
      }
      updates.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates);
    if (!user) {
      res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    res.json({
      success: true,
      user: {
        ...user,
        isPro: User.isPro(user),
        creditsRemaining: User.creditsRemaining(user)
      }
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ 
        success: false,
        message: 'Both passwords are required' 
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

export const googleSuccess = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'Not authenticated' 
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        role: user.role,
        subscription: user.subscription,
        isPro: User.isPro(user)
      }
    });
  } catch (error) {
    console.error('❌ Google success error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};