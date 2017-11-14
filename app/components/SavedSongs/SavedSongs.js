import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View } from 'react-native';

import SongsDB from '../../db/realm';
import Player from '../../lib/Player';

import Header from '../Header/Header';
import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import SavedSongsView from './SavedSongsView';

class SavedSongs extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    if (!this.props.player) {
      this.props.initializePlayer();
    }

    const songsDB = new SongsDB();
    this.state = {
      songsDB: songsDB,
      songs: [],
    };
  }

  componentWillMount() {
    const { songsDB } = this.state;

    songsDB.open().then(() => {
      const songs = songsDB.getAll().map((song) => ({
        key: song.videoId,
        videoId: song.videoId,
        title: song.title,
      }));
      this.setState({ songs: songs });
    });
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

  _onPressPlay = (videoId, title, thumbnail) => {
    this.props.setCurrentSongInfo(videoId, title, thumbnail);

    if (videoId == this.props.player.videoId) {
      if (this.props.playingStatus) {
        this.props.playerPause();
        this.props.player.pause();
      } else {
        this.props.playerPlay();
        this.props.player.play(() => this.props.playerPause());
      }
      return;
    }

    this.props.player.loadLocal(videoId)
      .then(() => {
        this.props.player.play(() => this.props.playerPause());
        this.props.playerPlay();
      })
      .catch((error) => console.log(error));
  }

  render() {
    if (!this.props.player) {
      // TODO: add loading spinner
      return (
        <View>Loading...</View>
      );
    }

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
