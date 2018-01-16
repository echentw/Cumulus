import * as types from './types';

export function setCurrentlyDownloading({ videoId, songTitle, songThumbnail }) {
  return {
    type: types.SET_CURRENTLY_DOWNLOADING,
    videoId: videoId,
    songTitle: songTitle,
    songThumbnail: songThumbnail,
  };
}
