import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import SongOptions from '../components/SongOptions';

import { saveSong } from '../db/realm';

class SongOptionsContainer extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
  }

  _onPress(value) {
    if (value == 'Download song') {
      console.log('you want to download song with id ' + this.props.songInfo.videoId);
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/songs').then(() => {
        RNFS.downloadFile({
          fromUrl: 'http://localhost:3000/downloads/song_' + this.props.songInfo.videoId + '.mp3',
          toFile: RNFS.DocumentDirectoryPath + '/songs/song_' + this.props.songInfo.videoId + '.mp3',
          begin: (res) => {
            console.log('download has begun', res);
          },
          progress: (res) => {
            console.log('download progress', res);
          },
        }).promise.then((result) => {
          if (result.statusCode == 200) {
            saveSong(this.props.songInfo.videoId, this.props.songInfo.title, () => {
              console.log('done writing to db!');
            });
          }
        })
        .catch((error) => {
          console.log('an error occurred in the downloading', error);
        });
      });
    } else {
      console.log('you pressed ' + value);
      const songs = getSongs().map((song) => ({title: song.title, videoId: song.videoId}));
      console.log(songs);
    }
  }

  render() {
    return (
      <SongOptions
        songInfo={this.props.songInfo}
        songInfoBlur={this.props.songInfoBlur}
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

export default connect(mapStateToProps, mapDispatchToProps)(SongOptionsContainer);
