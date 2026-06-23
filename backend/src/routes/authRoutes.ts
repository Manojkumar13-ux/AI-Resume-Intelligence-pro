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

// ============================================
// LOCAL AUTH ROUTES
// ============================================
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// ============================================
// GOOGLE OAUTH ROUTES - MUST BE DEFINED
// ============================================
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
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
      res.redirect(`${frontendUrl}/auth/success?token=${token}`);
    } catch (error) {
      console.error('❌ Google callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

router.get('/google/success', auth, googleSuccess);

export default router;