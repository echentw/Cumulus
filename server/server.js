import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import google from 'googleapis';
import redis from 'redis';
import { spawn } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import url from 'url';

import mysql from 'mysql';

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

app.post('/token', authenticate, (req, res) => {
  const refreshToken = req.headers.authorization.substring('Bearer '.length);
  redisClient.hmget([refreshToken, 'refreshToken'], (err, response) => {
    if (err) {
      return res.status(500).send({ message: 'Internal server error.' });
    }

    const refreshToken = response[0];
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    oauth2Client.refreshAccessToken((err, tokens) => {
      const accessToken = tokens.access_token;
      redisClient.hmset([refreshToken,
        'accessToken', accessToken,
      ], (err, response) => {
        if (err) return res.status(500).send({ message: 'Internal server error.' });
        res.status(200).send({ accessToken: accessToken });
      });
    });
  });
});

app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.post('/download', authenticate, (req, res) => {
  const { videoId } = req.body;

  // Escape all non-alphanumeric characters.
  const escapedVideoId = videoId.replace(/([^a-zA-Z0-9_-])/g, '\\$1');

  const child = spawn('./check_and_download_youtube.py', ['--videoId', 'song_' + escapedVideoId]);
  child.on('exit', (code, signal) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
    if (code == 0) {
      return res.status(200).send({ message: 'Mp3 file is finished processing!' });
    } else {
      return res.status(500).send({ message: 'Internal server error.' });
    }
  });
  child.stdout.on('data', (data) => console.log(`child stdout: ${data}`));
  child.stderr.on('data', (data) => console.error(`child stderr: ${data}`));
});

/*
CREATE TABLE exports (
  phrase VARCHAR(40) NOT NULL,
  playlist_title VARCHAR(40),
  video_id VARCHAR(40) NOT NULL
);
*/

app.post('/export', (req, res) => {
  console.log(JSON.stringify(req.body));
  const { phrase, playlists } = req.body;
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'airtube',
  });

  connection.connect();
  connection.query(`DELETE FROM exports WHERE phrase = "${phrase}"`, (error, results, fields) => {
    if (error) {
      console.log('something went wrong trying to clear exports for ' + phrase);
      res.send({ success: false });
    } else {
      console.log('successfully cleared exports for ' + phrase);

      playlists.forEach((playlist) => {
        const values = playlist.videoIds
          .map((videoId) => `("${phrase}", "${playlist.title}", "${videoId}")`)
          .join(', ');
        const command = `INSERT INTO exports (phrase, playlist_title, video_id) VALUES ${values}`;
        connection.query(command, (error, results, fields) => {
          if (error) {
            console.log('something went wrong');
            res.send({ success: false });
          } else {
            console.log('yay');
          }
        });
      });
    }
  });

  res.send({ success: true });


/***
  {
    playlists: [
      {
        name: 'Taylor Swift'
        videoIds: [
          'asdflkj',
          'lkjasdf',
        ],
      },
      {
        name: 'Kpop',
        videoIds: [
          'qwerpoiu',
          'poiureqw',
        ],
      },
    ],
***/
});

app.get('/checkdownload', authenticate, (req, res) => {
  const query = url.parse(req.url, true).query;
  const { videoId } = query;
  fs.access(`./downloads/song_${videoId}.mp3`, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(200).send({ complete: false });
    } else {
      res.status(200).send({ complete: true });
    }
  });
});

app.get('/checksum', authenticate, (req, res) => {
  const query = url.parse(req.url, true).query;
  const { videoId } = query;

  const shasum = crypto.createHash('sha256');

  const filepath = `./downloads/song_${videoId}.mp3`;
  const stream = fs.ReadStream(filepath);
  stream.on('data', (data) => shasum.update(data));
  stream.on('end', () => {
    const checksum = shasum.digest('hex');
    res.status(200).send({ checksum: checksum });
  });
});

const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
