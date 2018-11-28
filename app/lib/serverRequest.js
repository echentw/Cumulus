import { AsyncStorage } from 'react-native';

const serverUrl = 'http://localhost:3000';

function _generatePhrase() {
  const words = [
    'cat', 'dog', 'puppy', 'peanut', 'butter', 'penguin', 'tiger', 'house', 'wonder',
    'hamster', 'green', 'orange', 'red', 'blue', 'yellow', 'purple', 'maroon', 'banana',
    'apple', 'peach', 'kiwi', 'avocado', 'panda', 'bear', 'dolphin',
  ];
  const phrase = [];
  for (let i = 0; i < 3; ++i) {
    const index = Math.floor(Math.random() * words.length);
    const word = words[index];
    phrase.push(word);
  }
  return phrase.join('-');
}

function _actuallyExport(phrase, blob) {
  blob['phrase'] = phrase;
  return new Promise((resolve) => {
    fetch(serverUrl + '/export', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(blob),
      })
      .then((result) => {
        if (result.ok) {
          const blob = JSON.parse(result._bodyInit);
          if (blob.success) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .catch(() => resolve(false));
  });
}

export function exportPlaylists(blob) {
  return new Promise((resolve) => {
    AsyncStorage.getItem('exportKeyphrase')
      .then((phrase) => {
        if (!phrase) {
          const phrase = _generatePhrase();
          AsyncStorage.setItem('exportKeyphrase', phrase).then(() => {
            _actuallyExport(phrase, blob).then((success) => {
              if (success) {
                resolve(phrase);
              } else {
                resolve(false);
              }
            });
          });
        } else {
          _actuallyExport(phrase, blob).then((success) => {
            if (success) {
              resolve(phrase);
            } else {
              resolve(false);
            }
          });
        }
      });
  });
}

export function downloadVideoToServer(videoId) {
  return AsyncStorage.getItem('refreshToken')
    .then((token) => {
      return fetch(serverUrl + '/download', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          videoId: videoId,
        }),
      });
    });
}

export function checkVideoDownloadedToServer(videoId) {
  return AsyncStorage.getItem('refreshToken')
    .then((token) => {
      return fetch(serverUrl + `/checkdownload?videoId=${videoId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
      });
    });
}

export function refreshAccessToken() {
  return AsyncStorage.getItem('refreshToken')
    .then((token) => {
      return fetch(serverUrl + '/token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
      });
    });
}

export function getServerChecksum(videoId) {
  return AsyncStorage.getItem('refreshToken')
    .then((token) => {
      return fetch(serverUrl + `/checksum?videoId=${videoId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
      });
    });
}

export function getAudioUrl(videoId) {
  return `${serverUrl}/downloads/song_${videoId}.mp3`;
}

export function getOAuthEntrypoint() {
  return `${serverUrl}/auth/google`;
}
