import * as types from './types';

export function setCurrentSongInfo(title, thumbnail) {
  return {
    type: types.SET_CURRENT_SONG_INFO,
    title: title,
    thumbnail: thumbnail,
  };
}
