import * as types from './types';

export function songInfoFocus(videoId) {
  return {
    type: types.SONG_INFO_FOCUS,
    videoId: videoId,
  };
}

export function songInfoBlur() {
  return {
    type: types.SONG_INFO_BLUR,
  };
}
