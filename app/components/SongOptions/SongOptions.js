import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import { downloadVideoToServer, getAudioUrl } from '../../lib/serverRequest';
import SongsDB from '../../db/realm';

import SongOptionsView from './SongOptionsView';

class SongOptions extends Component {
  constructor(props) {
    super(props);

    const songsDB = new SongsDB();
    songsDB.open().then(() => console.log('finished opening'));
    this.state = {
      songsDB: songsDB,
    };
  }

  componentWillUnmount() {
    this.props.songInfoBlur();
  }

  _onPress = (value) => {
    const { videoId, title, thumbnail } = this.props.songInfo;

    if (value == 'Download song') {
      if (this.state.songsDB.exists(videoId)) {
        console.log('this particular video has already been downloaded');
        return;
      }

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
          return this.state.songsDB.create(videoId, title);
        } else {
          return new Promise((resolve, reject) => reject('error fetching data from server'));
        }
      })
      .then(() => console.log('successfully wrote to db!'))
      .catch((err) => console.log('an error happened', err));
    } else if (value == 'Add to playlist') {
      console.log('you wanna add this to a playlist hmmm');
    } else if (value == 'Cancel') {
      this.props.navigator.dismissLightBox();
    } else {
      console.log('you pressed ' + value);
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
