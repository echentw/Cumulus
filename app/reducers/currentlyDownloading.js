import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const currentlyDownloading = createReducer({
  videoId: null,
  songTitle: null,
  songThumbnail: { url: null },
}, {
  [types.SET_CURRENTLY_DOWNLOADING]: (state, action) => {
    return {
      videoId: action.videoId,
      songTitle: action.songTitle,
      songThumbnail: action.songThumbnail,
    };
  },
  [types.SET_CURRENTLY_PLAYING]: (state, action) => {
    return {
      videoId: null,
      songTitle: null,
      songThumbnail: { url: null },
    };
  },
});
