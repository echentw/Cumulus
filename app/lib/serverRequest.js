import { AsyncStorage } from 'react-native';

const serverUrl = 'http://localhost:3000';

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
