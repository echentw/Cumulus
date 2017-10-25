import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const songInfo = createReducer({videoId: null, title: null}, {
  [types.SONG_INFO_FOCUS]: (state, action) => {
    return {
      videoId: action.videoId,
      title: action.title,
    };
  },
  [types.SONG_INFO_BLUR]: (state, action) => {
    return {
      videoId: null,
      title: null,
    };
  },
});
