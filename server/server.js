import express from 'express';
import path from 'path';
import fs from 'fs';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { google } from './config';

import googleapi from 'googleapis';

// Configure google api client.
// TODO: this is not needed, but committing this in case this is useful in the future?
const OAuth2 = googleapi.auth.OAuth2;
const oauth2Client = new OAuth2(google.clientID, google.clientSecret, google.callbackURL);
const youtubeClient = googleapi.youtube('v3');

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
passport.use(new GoogleStrategy(google,
  (accessToken, refreshToken, profile, done) => {
    tokenStore[profile.id] = accessToken;
    console.log(accessToken);

    // TODO: see above, this is not needed.
    // oauth2Client.setCredentials({
    //   access_token: accessToken,
    // });
    // const params = {
    //   q: 'just a dream',
    //   part: 'snippet',
    //   maxResults: 5,
    //   auth: oauth2Client,
    // };
    // youtubeClient.search.list(params, [], (err, response) => {
    //   console.log('request successful!');
    // });

    done(null, transformGoogleProfile(profile._json))
  }
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

// app.use(express.static(path.join(__dirname, 'views')));
// app.get('/loadgapi', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));

// Launch the server on the port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
