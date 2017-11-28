import RNFS from 'react-native-fs';

import songsDB from '../db/SongsDB';
import { downloadVideoToServer, getAudioUrl, getOAuthEntrypoint } from './serverRequest';

function mp3Path(videoId) {
  return RNFS.DocumentDirectoryPath + '/songs/song_' + videoId + '.mp3';
}

export function thumbnailPath(videoId) {
  return RNFS.DocumentDirectoryPath + '/thumbnails/thumbnail_' + videoId + '.jpg';
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
      toFile: mp3Path(videoId),
      begin: (res) => console.log('download song has begun', res),
      progress: (res) => console.log('download progress', res),
    }).promise;

    const thumbnailDownloadPromise = RNFS.downloadFile({
      fromUrl: thumbnail.url,
      toFile: thumbnailPath(videoId),
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

export function removeSong(videoId) {
  return Promise.all([
    songsDB.delete(videoId),
    RNFS.unlink(mp3Path(videoId)),
    RNFS.unlink(thumbnailPath(videoId)),
  ]);
}
