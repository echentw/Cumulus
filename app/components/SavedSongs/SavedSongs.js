import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View } from 'react-native';

import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import { getSongs } from '../../db/realm';
import { onPlayEnd } from '../../lib/player';

import Header from '../Header/Header';
import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import SavedSongsView from './SavedSongsView';

class SavedSongs extends Component {
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

  _setPlayer = (videoId, sound) => {
    if (this.props.player.sound) {
      this.props.player.sound.stop(() => {
        this.props.player.sound.release();
        this.props.setPlayer(videoId, sound);
        this.props.playerPlay();
      });
    } else {
      this.props.setPlayer(videoId, sound);
      this.props.playerPlay();
    }
  }

  _onPressPlay = (videoId, title, thumbnail) => {
    this.props.setCurrentSongInfo(title, thumbnail);

    if (videoId == this.props.player.videoId) {
      if (this.props.playingStatus) {
        this.props.playerPause();
        this.props.player.sound.pause();
      } else {
        this.props.playerPlay();
        this.props.player.sound.play(onPlayEnd.bind(this));
      }
      return;
    }

    const sound = new Sound('song_' + videoId + '.mp3', RNFS.DocumentDirectoryPath + '/songs', (error) => {
      if (error) {
        console.log('failed to load sound', error);
        return;
      }
      sound.setNumberOfLoops(-1);
      sound.play(onPlayEnd.bind(this));
      this._setPlayer(videoId, sound);
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title='Saved Songs'/>
        <SavedSongsView
          songs={this.state.songs}
          onPressPlay={this._onPressPlay}
          videoIdPlaying={this.props.player.videoId}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedSongs);
