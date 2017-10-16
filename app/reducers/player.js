import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const playerState = createReducer({}, {
  [types.PLAY_VIDEO]: (state, action) => {
    return state;
  },
  [types.PAUSE_VIDEO]: (state, action) => {
    return state;
  },
});
