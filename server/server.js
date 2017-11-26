import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import google from 'googleapis';
import redis from 'redis';
import { spawn } from 'child_process';

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');

dotenv.config();

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['profile', 'https://www.googleapis.com/auth/youtube'],
  prompt: 'consent',
});

function authenticate(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please log in.' });
  }
  const refreshToken = req.headers.authorization.substring('Bearer '.length);
  if (redisClient.exists(refreshToken)) {
    next();
  } else {
    res.status(401).send({ message: 'Please log in.' });
  }
}

const app = express();
app.use(bodyParser.json());

// Set up Google auth routes
app.get('/auth/google', (req, res) => {
  res.redirect(googleAuthUrl);
});

app.get('/auth/google/callback', (req, res) => {
  const { code } = req.query;
  oauth2Client.getToken(code, (err, tokens) => {
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    plus.people.get({ userId: 'me', auth: oauth2Client }, (err, response) => {
      if (err) res.redirect('/auth/google');
      const { id, displayName, image } = response;

      redisClient.hmset([refreshToken,
        'accessToken', accessToken,
        'refreshToken', refreshToken,
      ], (err, response) => {
        if (err) return res.redirect('/auth/google');
        res.redirect(`Cumulus://login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
      });
    });
  });
});

app.use('/downloads', authenticate, express.static(path.join(__dirname, 'downloads')));

app.post('/play', authenticate, (req, res) => {
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

const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
