import RNFS from 'react-native-fs';

import songsDB from '../db/realm';

const serverUrl = 'http://localhost:3000';

export function downloadVideoToServer(videoId) {
  return fetch(serverUrl + '/play', {
    // TODO: authenticate this post request
    method: 'POST',
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

export function downloadSong(videoId, title, thumbnail) {
  return Promise.all([
    downloadVideoToServer(videoId),
    RNFS.mkdir(RNFS.DocumentDirectoryPath + '/songs'),
    RNFS.mkdir(RNFS.DocumentDirectoryPath + '/thumbnails'),
  ])
  .then(() => {
    const songDownloadPromise = RNFS.downloadFile({
      fromUrl: getAudioUrl(videoId),
      toFile: RNFS.DocumentDirectoryPath + '/songs/song_' + videoId + '.mp3',
      begin: (res) => console.log('download song has begun', res),
      progress: (res) => console.log('download progress', res),
    }).promise;

    const thumbnailDownloadPromise = RNFS.downloadFile({
      fromUrl: thumbnail.url,
      toFile: RNFS.DocumentDirectoryPath + '/thumbnails/thumbnail_' + videoId + '.jpg',
      begin: (res) => console.log('download thumbnail has begun', res),
    }).promise;

    songDownloadPromise.catch((error) => console.log('error in downloading', error));
    thumbnailDownloadPromise.catch((error) => console.log('error in downloading', error));

    return Promise.all([songDownloadPromise, thumbnailDownloadPromise]);
  })
  .then((results) => {
    if (results[0].statusCode == 200 && results[1].statusCode == 200) {
      return songsDB.create(videoId, title);
    } else {
      return new Promise((resolve, reject) => reject('error fetching data from server'));
    }
  });
}
