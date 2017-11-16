import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { View } from 'react-native';

import { downloadVideoToServer } from '../../lib/serverRequest.js';
import Player from '../../lib/Player';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import SearchView from './SearchView';

class Search extends Component {
  constructor(props) {
    super(props);
    if (!this.props.player) {
      this.props.initializePlayer();
    }
  }

  _onPressMoreInfo = (videoId, title, thumbnail) => {
    this.props.songInfoFocus(videoId, title, thumbnail);
    this.props.navigator.showLightBox({
      screen: 'Cumulus.SongOptions',
      style: {
        backgroundBlur: 'light',
        backgroundColor: '#88888820',
        tapBackgroundToDismiss: true,
      },
    });
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

    downloadVideoToServer(videoId)
      .then((response) => {
        // TODO: might want to figure out how to deal with error here
        return this.props.player.loadRemote(videoId)
      })
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
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <SearchView
          searchResults={this.props.searchResults}
          onPressPlay={this._onPressPlay}
          videoIdPlaying={this.props.currentSongInfo.videoId}
          onPressMoreInfo={this._onPressMoreInfo}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    player: state.player,
    playingStatus: state.playingStatus,
    searchQuery: state.searchQuery,
    searchResults: state.searchResults,
    currentSongInfo: state.currentSongInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
