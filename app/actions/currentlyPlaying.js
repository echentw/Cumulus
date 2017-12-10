import * as types from './types';

export function setCurrentlyPlaying({ playlistId, videoId, songTitle, songThumbnail }) {
  return {
    type: types.SET_CURRENTLY_PLAYING,
    playlistId: playlistId,
    videoId: videoId,
    songTitle: songTitle,
    songThumbnail: songThumbnail,
  };
}

export function setLoopStatus(loopStatus) {
  return {
    type: types.SET_LOOP_STATUS,
    loopStatus: loopStatus,
  };
}
