import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  googleSuccess 
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Local auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('🔑 Google login initiated');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
});

router.get('/google/callback', 
  (req, res, next) => {
    console.log('🔄 Google callback received');
    next();
  },
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login?error=google_auth_failed'
  }),
  (req, res) => {
    try {
      console.log('✅ Google authentication successful');
      const user = req.user as any;
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'https://ai-resume-intellegence-pro.vercel.app';
      console.log(`🔀 Redirecting to: ${frontendUrl}/auth/success?token=${token}`);
      res.redirect(`${frontendUrl}/auth/success?token=${token}`);
    } catch (error) {
      console.error('❌ Google callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

// Google success endpoint
router.get('/google/success', auth, googleSuccess);

export default router;