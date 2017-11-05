import * as types from './types';

export function setCurrentSongInfo(videoId, title, thumbnail) {
  return {
    type: types.SET_CURRENT_SONG_INFO,
    videoId: videoId,
    title: title,
    thumbnail: thumbnail,
  };
}
