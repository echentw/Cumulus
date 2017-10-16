import express from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { google } from './config';

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  name: profile.displayName,
  avatar: profile.image.url,
});

// Register Google Passport strategy
passport.use(new GoogleStrategy(google,
  async (accessToken, refreshToken, profile, done)
    => done(null, transformGoogleProfile(profile._json))
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));

// Initialize http server
const app = express();

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => res.redirect('Cumulus://login?user=' + JSON.stringify(req.user)));

// Launch the server on the port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
