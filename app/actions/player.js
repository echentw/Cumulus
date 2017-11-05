import * as types from './types';

export function initializePlayer() {
  return {
    type: types.INITIALIZE_PLAYER,
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
