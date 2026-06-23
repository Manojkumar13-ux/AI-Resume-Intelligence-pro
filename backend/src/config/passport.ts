import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User.js';  // Use named import
import dotenv from 'dotenv';

dotenv.config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.userId);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;