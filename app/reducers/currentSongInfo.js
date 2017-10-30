import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const currentSongInfo = createReducer({title: null, thumbnail: null}, {
  [types.SET_CURRENT_SONG_INFO]: (state, action) => {
    return {
      title: action.title,
      thumbnail: action.thumbnail,
    };
  },
});
