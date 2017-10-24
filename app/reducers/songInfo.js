import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const songInfo = createReducer(null, {
  [types.SONG_INFO_FOCUS]: (state, action) => {
    return action.videoId;
  },
  [types.SONG_INFO_BLUR]: (state, action) => {
    return null;
  },
});
