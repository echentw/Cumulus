import * as types from './types';

export function setPlayer(videoId, sound) {
  return {
    type: types.SET_PLAYER,
    videoId: videoId,
    sound: sound,
  };
}

export function playerPlay() {
  return {
    type: types.PLAYER_PLAY,
  };
}

export function playerPause() {
  return {
    type: types.PLAYER_PAUSE,
  }
}
