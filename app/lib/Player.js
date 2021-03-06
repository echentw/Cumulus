import RNSound from 'react-native-sound';
RNSound.setCategory('Playback');

import RNFS from 'react-native-fs';

import { getAudioUrl } from './serverRequest';

export default class Player {
  constructor() {
    this.videoId = null; // string
    this.player = null; // RNSound
    this.onCompleteCallback = () => {};
  }

  _reset = (videoId) => {
    if (this.player && this.player.videoId != videoId) {
      this.player.release();
    }
  }

  isReady = () => {
    return this.player != null;
  }

  // Returns Promise<null> when loading is done.
  loadRemote = (videoId) => {
    if (this.videoId == videoId) {
      return new Promise((resolve, reject) => resolve());
    }

    this._reset(videoId);

    const url = getAudioUrl(videoId);
    return new Promise((resolve, reject) => {
      this.player = new RNSound(url, null, (error) => {
        if (error) {
          reject(error);
        } else {
          this.videoId = videoId;
          this.setLoop(true);
          resolve();
        }
      });
    });
  }

  loadLocal = (videoId) => {
    this._reset(videoId);
    const isLooping = this.player ? this.isLooping() : false;
    const dir = RNFS.DocumentDirectoryPath + '/songs';
    const audioFile = 'song_' + videoId + '.mp3';
    return new Promise((resolve, reject) => {
      this.player = new RNSound(audioFile, dir, (error) => {
        if (error) {
          reject(error);
        } else {
          this.videoId = videoId;
          this.setLoop(isLooping);
          resolve();
        }
      });
    });
  }

  setOnCompleteCallback = (callback) => {
    this.onCompleteCallback = callback;
  }

  play = () => {
    this.player.play((success) => {
      if (success) {
        this.onCompleteCallback();
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  }

  pause = () => {
    this.player.pause();
  }

  setLoop = (loop) => {
    if (loop) {
      this.player.setNumberOfLoops(-1);
    } else {
      this.player.setNumberOfLoops(0);
    }
  }

  isLooping = () => {
    return this.player.getNumberOfLoops() == -1;
  }

  setCurrentTime = (seconds) => this.player.setCurrentTime(seconds);

  getCurrentTime = () => {
    return new Promise((resolve, reject) => {
      this.player.getCurrentTime((seconds) => resolve(seconds));
    });
  }

  getDuration = () => {
    return this.player.getDuration();
  }
}
