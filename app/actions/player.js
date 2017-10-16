import * as types from './types';

export function playVideo() {
  return {
    type: types.PLAY_VIDEO,
  }
}

export function pauseVideo() {
  return {
    type: types.PAUSE_VIDEO,
  }
}
