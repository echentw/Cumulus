import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import {
  View,
  Text,
  Animated,
} from 'react-native';

import { downloadVideoToServer } from '../../lib/serverRequest';
import Player from '../../lib/Player';
import ActionSheet from '../../lib/actionsheets';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import SearchView from './SearchView';

class Search extends Component {
  constructor(props) {
    super(props);
    if (!this.props.player) {
      this.props.initializePlayer();
    }
    this.state = { opacity: new Animated.Value(0) };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.player != nextProps.player ||
      this.props.currentlyPlaying != nextProps.currentlyPlaying ||
      this.props.currentlyDownloading != nextProps.currentlyDownloading ||
      this.props.searchResults != nextProps.searchResults ||
      this.props.searchBarFocused != nextProps.searchBarFocused
    );
  }

  _onPressMoreInfo = (videoId, songTitle, songThumbnail) => {
    ActionSheet.searchResultOptions(videoId, songTitle, songThumbnail);
  }

  _onPressPlay = (videoId, songTitle, songThumbnail) => {
    this.props.setCurrentlyDownloading({
      videoId: videoId,
      songTitle: songTitle,
      songThumbnail: songThumbnail,
    });

    if (videoId == this.props.player.videoId) {
      this.props.setCurrentlyPlaying({
        playlistId: null,
        videoId: videoId,
        songTitle: songTitle,
        songThumbnail: songThumbnail,
      });

      if (this.props.playingStatus) {
        this.props.playerPause();
        this.props.player.pause();
      } else {
        this.props.playerPlay();
        this.props.player.play();
      }
      return;
    }

    downloadVideoToServer(videoId)
      .then((response) => {
        // TODO: might want to figure out how to deal with error here
        return this.props.player.loadRemote(videoId)
      })
      .then(() => {
        this.props.setCurrentlyPlaying({
          playlistId: null,
          videoId: videoId,
          songTitle: songTitle,
          songThumbnail: songThumbnail,
        });
        this.props.player.play();
        this.props.playerPlay();
      })
      .catch((error) => console.log(error));
  }

  render() {
    if (!this.props.player) {
      // TODO: add loading spinner
      return (
        <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </View>
          <CurrentSongFooter navigator={this.props.navigator}/>
        </View>
      );
    }

    const nextOpacity = this.props.searchBarFocused ? 0.25 : 0;
    Animated.timing(this.state.opacity, {
      toValue: nextOpacity,
      duration: 250,
    }).start();

    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <SearchView
          searchResults={this.props.searchResults}
          onPressPlay={this._onPressPlay}
          onPressMoreInfo={this._onPressMoreInfo}
          videoIdPlaying={this.props.currentlyPlaying.videoId}
          videoIdDownloading={this.props.currentlyDownloading.videoId}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            opacity: this.state.opacity,
          }}
          pointerEvents='none'
        />
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
    currentlyPlaying: state.currentlyPlaying,
    currentlyDownloading: state.currentlyDownloading,
    searchBarFocused: state.searchBarFocused,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
