import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import RNFS from 'react-native-fs';
import { getSongs } from '../db/realm';

import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import SavedSongs from '../components/SavedSongs';

class SavedSongsContainer extends Component {
  constructor(props) {
    super(props);

    const songs = getSongs().map((song) => ({
      key: song.videoId,
      videoId: song.videoId,
      title: song.title,
    }));

    this.state = {
      songs: songs,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'DeepLink') {
      this.props.navigator.resetTo({
        screen: event.link,
        animated: true,
        animationType: 'fade',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    }
  }

  _onPressPlay = (videoId) => {
    if (this.props.player.sound) {
      this.props.player.sound.release();
    }

    const sound = new Sound('song_' + videoId + '.mp3', RNFS.DocumentDirectoryPath + '/songs', (error) => {
      if (error) {
        console.log('failed to load sound', error);
        return;
      }
      sound.setNumberOfLoops(-1);
      sound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      this.props.setPlayer(videoId, sound);
    });
  }

  render() {
    return (
      <SavedSongs
        songs={this.state.songs}
        onPressPlay={this._onPressPlay}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    playingStatus: state.playingStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedSongsContainer);
