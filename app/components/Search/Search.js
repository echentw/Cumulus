import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import {
  View,
  Text,
  ActionSheetIOS,
  Animated,
} from 'react-native';

import { downloadVideoToServer } from '../../lib/serverRequest';
import { downloadSong } from '../../lib/songManagement';
import Player from '../../lib/Player';
import PlaylistsDB from '../../db/PlaylistsDB';

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
      this.props.searchResults != nextProps.searchResults ||
      this.props.searchBarFocused != nextProps.searchBarFocused
    );
  }

  _onPressMoreInfo = (videoId, title, thumbnail) => {
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
        const playlists = PlaylistsDB.getAll();
        const playlistTitles = playlists.map((playlist) => playlist.title);
        ActionSheetIOS.showActionSheetWithOptions({
          options: [...playlistTitles, 'Cancel'],
          cancelButtonIndex: playlistTitles.length,
          title: 'Add to playlist',
          tintColor: 'black',
        }, (index) => {
          if (index < playlistTitles.length) {
            downloadSong(videoId, title, thumbnail)
              .then(() => {
                console.log('done writing to db!');
                const playlistId = playlists[index].playlistId;
                PlaylistsDB.addSong(playlistId, videoId);
              })
              .catch((err) => console.log('an error happened', err));
          }
        });
      }
    });
  }

  _onPressPlay = (videoId, songTitle, songThumbnail) => {
    this.props.setCurrentlyPlaying({
      playlistId: null,
      videoId: videoId,
      songTitle: songTitle,
      songThumbnail: songThumbnail,
    });

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
    searchBarFocused: state.searchBarFocused,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
