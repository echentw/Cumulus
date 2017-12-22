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

  _init = (videoId) => {
    if (this.player && this.player.videoId != videoId) {
      this.player.release();
    }
    this.videoId = videoId;
  }

  isReady = () => {
    return this.player != null;
  }

  // Returns Promise<null> when loading is done.
  loadRemote = (videoId) => {
    this._init(videoId);

    const url = getAudioUrl(videoId);
    return new Promise((resolve, reject) => {
      this.player = new RNSound(url, null, (error) => {
        if (error) {
          reject(error);
        } else {
          this.player.setNumberOfLoops(-1);
          resolve();
        }
      });
    });
  }

  loadLocal = (videoId) => {
    this._init(videoId);
    const dir = RNFS.DocumentDirectoryPath + '/songs';
    const audioFile = 'song_' + videoId + '.mp3';
    return new Promise((resolve, reject) => {
      this.player = new RNSound(audioFile, dir, (error) => {
        if (error) {
          reject(error);
        } else {
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
