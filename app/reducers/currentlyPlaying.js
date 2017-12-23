import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

import { randomPermutation } from '../lib/utils';

export const currentlyPlaying = createReducer({
  playlistId: null,
  videoId: null,
  songTitle: null,
  songThumbnail: { url: null },
  loopStatus: null,
  shuffleOrder: null,
}, {
  [types.SET_CURRENTLY_PLAYING]: (state, action) => {
    return {
      playlistId: action.playlistId,
      videoId: action.videoId,
      songTitle: action.songTitle,
      songThumbnail: action.songThumbnail,
      loopStatus: state.loopStatus,
      shuffleOrder: state.shuffleOrder,
    };
  },
  [types.SET_LOOP_STATUS]: (state, action) => {
    return {
      playlistId: state.playlistId,
      videoId: state.videoId,
      songTitle: state.songTitle,
      songThumbnail: state.songThumbnail,
      loopStatus: action.loopStatus,
      shuffleOrder: state.shuffleOrder,
    };
  },
  [types.TOGGLE_PLAYLIST_SHUFFLE]: (state, action) => {
    const shouldShuffle = (state.shuffleOrder == null);
    const shuffleOrder = shouldShuffle ? randomPermutation(action.songs) : null;
    return {
      playlistId: state.playlistId,
      videoId: state.videoId,
      songTitle: state.songTitle,
      songThumbnail: state.songThumbnail,
      loopStatus: state.loopStatus,
      shuffleOrder: shuffleOrder,
    };
  },
});
