import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import { downloadVideoToServer, getAudioUrl } from '../../lib/serverRequest';

import SongOptionsView from './SongOptionsView';

import { saveSong, getSongs } from '../../db/realm';

class SongOptions extends Component {
  _onPress = (value) => {
    const { videoId, title, thumbnail } = this.props.songInfo;

    if (value == 'Download song') {
      Promise.all([
        downloadVideoToServer(videoId),
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/songs'),
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/thumbnails'),
      ])
      .then(() => {
        const songDownloadPromise = RNFS.downloadFile({
          fromUrl: getAudioUrl(videoId),
          toFile: RNFS.DocumentDirectoryPath + '/songs/song_' + videoId + '.mp3',
          begin: (res) => console.log('download song has begun', res),
          progress: (res) => console.log('download progress', res),
        }).promise;

        const thumbnailDownloadPromise = RNFS.downloadFile({
          fromUrl: thumbnail.url,
          toFile: RNFS.DocumentDirectoryPath + '/thumbnails/thumbnail_' + videoId + '.jpg',
          begin: (res) => console.log('download thumbnail has begun', res),
        }).promise;

        songDownloadPromise.catch((error) => console.log('error in downloading', error));
        thumbnailDownloadPromise.catch((error) => console.log('error in downloading', error));

        return Promise.all([songDownloadPromise, thumbnailDownloadPromise]);
      })
      .then((results) => {
        if (results[0].statusCode == 200 && results[1].statusCode == 200) {
          saveSong(videoId, title, () => {
            console.log('done writing to db!');
          });
        } else {
          console.log('error getting data back');
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      console.log('you pressed ' + value);
      const songs = getSongs().map((song) => ({title: song.title, videoId: song.videoId}));
      console.log(songs);
    }
  }

  _songInfoBlur = () => {
    this.props.navigator.dismissLightBox();
    this.props.songInfoBlur();
  }

  render() {
    return (
      <SongOptionsView
        songInfo={this.props.songInfo}
        songInfoBlur={this._songInfoBlur}
        onPress={this._onPress}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    songInfo: state.songInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SongOptions);
