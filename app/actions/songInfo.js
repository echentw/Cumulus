import * as types from './types';

export function songInfoFocus(videoId, title) {
  return {
    type: types.SONG_INFO_FOCUS,
    videoId: videoId,
    title: title,
  };
}

export function songInfoBlur() {
  return {
    type: types.SONG_INFO_BLUR,
  };
}
