import * as types from './types';

export function songInfoFocus(videoId, title, thumbnail) {
  return {
    type: types.SONG_INFO_FOCUS,
    videoId: videoId,
    title: title,
    thumbnail: thumbnail,
  };
}

export function songInfoBlur() {
  return {
    type: types.SONG_INFO_BLUR,
  };
}
