import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

import Player from '../lib/Player';

export const player = createReducer(null, {
  [types.INITIALIZE_PLAYER]: (state, action) => {
    return new Player();
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
