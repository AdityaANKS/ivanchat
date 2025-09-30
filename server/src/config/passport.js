import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { generateUsername } from '../utils/helpers.js';

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.userId).select('-password');
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          // Update Google ID if user exists but logged in with email before
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        const username = await generateUsername(profile.displayName);
        
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: username,
          displayName: profile.displayName,
          avatar: profile.photos[0]?.value?.replace('=s96-c', '=s256-c'), // Get larger image
          verified: true,
          provider: 'google',
          settings: {
            theme: 'dark',
            notifications: {
              email: true,
              push: true,
              desktop: true,
            },
          },
        });

        // Initialize gamification
        await initializeUserGamification(user._id);
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Helper function to initialize gamification
async function initializeUserGamification(userId) {
  const UserGamification = require('../models/UserGamification.js').default;
  
  await UserGamification.create({
    user: userId,
    level: {
      current: 1,
      experience: 0,
      experienceToNext: 100,
    },
    badges: [],
    stats: {
      messagesSent: 0,
      reactionsGiven: 0,
      reactionsReceived: 0,
    },
  });
}

export default passport;