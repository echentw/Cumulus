import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const player = createReducer({videoId: null, sound: null}, {
  [types.SET_PLAYER]: (state, action) => {
    return {
      videoId: action.videoId,
      sound: action.sound,
    };
  },
});

export const playingStatus = createReducer(true, {
  [types.PLAYER_PLAY]: (state, action) => {
    return true;
  },
  [types.PLAYER_PAUSE]: (state, action) => {
    return false;
  },
});
