import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const currentlyPlaying = createReducer({
  playlistId: null,
  videoId: null,
  songTitle: null,
  songThumbnail: { url: null },
  loopStatus: null,
}, {
  [types.SET_CURRENTLY_PLAYING]: (state, action) => {
    return {
      playlistId: action.playlistId,
      videoId: action.videoId,
      songTitle: action.songTitle,
      songThumbnail: action.songThumbnail,
      loopStatus: state.loopStatus,
    };
  },
  [types.SET_LOOP_STATUS]: (state, action) => {
    return {
      playlistId: state.playlistId,
      videoId: state.videoId,
      songTitle: state.songTitle,
      songThumbnail: state.songThumbnail,
      loopStatus: action.loopStatus,
    };
  },
});
