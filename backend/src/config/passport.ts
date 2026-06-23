import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

console.log('🔧 [passport.ts] Loading passport configuration...');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL || 'https://ai-resume-intelligence-pro-1.onrender.com';

console.log('📋 [passport.ts] Environment check:');
console.log('  - GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? '✅ Present' : '❌ MISSING');
console.log('  - GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? '✅ Present' : '❌ MISSING');
console.log('  - BASE_URL:', BASE_URL);

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ [passport.ts] Google OAuth credentials missing. Strategy will not be registered.');
} else {
  try {
    console.log('✅ [passport.ts] Registering Google Strategy...');
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${BASE_URL}/api/auth/google/callback`,
          passReqToCallback: true,
        },
        async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            console.log('🔑 [Google Strategy] Profile received:', profile.id);
            const email = profile.emails?.[0]?.value;
            if (!email) {
              console.error('❌ [Google Strategy] No email provided');
              return done(new Error('No email from Google'), undefined);
            }

            let user = await User.findOne({ email });
            if (user) {
              console.log('✅ [Google Strategy] Existing user found:', email);
              if (!user.googleId) {
                await User.findByIdAndUpdate(user.id, { googleId: profile.id });
              }
              return done(null, user);
            }

            console.log('🆕 [Google Strategy] Creating new user:', email);
            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
              email,
              name: profile.displayName || email.split('@')[0] || 'User',
              password: randomPassword,
              credits: 3,
              googleId: profile.id,
              isVerified: true,
            });
            console.log('✅ [Google Strategy] User created:', email);
            return done(null, user);
          } catch (error) {
            console.error('❌ [Google Strategy] Error:', error);
            return done(error, undefined);
          }
        }
      )
    );
    console.log('✅ [passport.ts] Google Strategy registered successfully.');
  } catch (error) {
    console.error('❌ [passport.ts] Failed to register Google Strategy:', error);
  }
}

export default passport;