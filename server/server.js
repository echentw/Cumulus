import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import passport from 'passport';
import { spawn } from 'child_process';
import GoogleStrategy from 'passport-google-oauth20';

// Load environment variables
dotenv.config();

const googleCreds = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  id: profile.id,
  name: profile.displayName,
  avatar: profile.image.url,
});

const tokenStore = {};

const stripIdFromProfileAndAddToken = (profile) => {
  const clone = Object.assign({}, profile, {token: tokenStore[profile.id]});
  delete clone.id;
  return clone;
};

// Register Google Passport strategy
passport.use(new GoogleStrategy(googleCreds,
  (accessToken, refreshToken, profile, done) => {
    tokenStore[profile.id] = accessToken;
    console.log(accessToken);
    done(null, transformGoogleProfile(profile._json))
  }
));

// Serialize / deserialize the user into the sessions.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Initialize http server
const app = express();

// Initialize middleware.
app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Google auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'profile',
    'https://www.googleapis.com/auth/youtube'
  ]
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    const user = stripIdFromProfileAndAddToken(req.user);
    res.redirect('Cumulus://login?user=' + JSON.stringify(user))
  }
);

app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
app.post('/play', (req, res) => {
  const { videoId } = req.body;

  // Escape all non-alphanumeric characters.
  const escapedVideoId = videoId.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

  const child = spawn('./check_and_download_youtube.py', ['--videoId', 'song_' + escapedVideoId]);
  child.on('exit', (code, signal) => {
    const message = `child process exited with code ${code} and signal ${signal}`;
    console.log(message);
    res.send({message: message});
  });

  child.stdout.on('data', (data) => console.log(`child stdout: ${data}`));
  child.stderr.on('data', (data) => console.error(`child stderr: ${data}`));
});

// Launch the server on the port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
