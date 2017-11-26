const serverUrl = 'http://localhost:3000';

export function downloadVideoToServer(videoId) {
  return fetch(serverUrl + '/play', {
    // TODO: authenticate this post request
    method: 'POST',
    credentials: 'include',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      videoId: videoId,
    }),
  });
}

export function getAudioUrl(videoId) {
  return `${serverUrl}/downloads/song_${videoId}.mp3`;
}

export function getOAuthEntrypoint() {
  return `${serverUrl}/auth/google`;
}
