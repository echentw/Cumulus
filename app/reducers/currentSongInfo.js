import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const currentSongInfo = createReducer({videoId: null, title: null, thumbnail: null}, {
  [types.SET_CURRENT_SONG_INFO]: (state, action) => {
    return {
      videoId: action.videoId,
      title: action.title,
      thumbnail: action.thumbnail,
    };
  },
});
