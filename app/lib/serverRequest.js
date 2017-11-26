import { AsyncStorage } from 'react-native';

const serverUrl = 'http://localhost:3000';

export function downloadVideoToServer(videoId) {
  return AsyncStorage.getItem('refreshToken')
    .then((token) => {
      return fetch(serverUrl + '/play', {
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

export function getAudioUrl(videoId) {
  return `${serverUrl}/downloads/song_${videoId}.mp3`;
}

export function getOAuthEntrypoint() {
  return `${serverUrl}/auth/google`;
}
