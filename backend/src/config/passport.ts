import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL || 'https://ai-resume-intelligence-pro-1.onrender.com';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails?.[0]?.value });
          if (!user) {
            user = await User.create({
              email: profile.emails?.[0]?.value,
              name: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'User',
              password: Math.random().toString(36).slice(-8),
              credits: 3,
              isVerified: true,
            });
          }
          return done(null, user);
        } catch (error) {
          console.error('Google Strategy Error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );
}

export default passport;