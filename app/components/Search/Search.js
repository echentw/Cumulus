import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { View, Text, ActionSheetIOS } from 'react-native';

import { downloadVideoToServer, downloadSong } from '../../lib/serverRequest.js';
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
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Download', 'Add to Playlist'],
      cancelButtonIndex: 0,
      title: title,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        downloadSong(videoId, title, thumbnail)
          .then(() => console.log('done writing to db!'))
          .catch((err) => console.log('an error happened', err));
      } else if (index == 2) {
        console.log('you want to add this to a playlist hmmm');
      }
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
        <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
          <Text>Loading...</Text>
          <CurrentSongFooter navigator={this.props.navigator}/>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <SearchView
          searchResults={this.props.searchResults}
          onPressPlay={this._onPressPlay}
          onPressMoreInfo={this._onPressMoreInfo}
          videoIdPlaying={this.props.currentSongInfo.videoId}
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
