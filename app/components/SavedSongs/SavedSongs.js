import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View, Text, ActionSheetIOS } from 'react-native';

import SongsDB from '../../db/SongsDB';
import PlaylistsDB from '../../db/PlaylistsDB';
import Player from '../../lib/Player';

import { removeSong } from '../../lib/songManagement';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import PlaybackCompletion from '../PlaybackCompletion/PlaybackCompletion';
import SavedSongsView from './SavedSongsView';

class SavedSongs extends Component {
  constructor(props) {
    super(props);
    if (!this.props.player) {
      this.props.initializePlayer();
    }

    const songs = SongsDB.getAll().map((song) => ({
      key: song.videoId,
      videoId: song.videoId,
      title: song.title,
    }));
    this.state = { songs: songs };
  }

  componentDidMount() {
    SongsDB.addOnChangeListener(() => {
      const songs = SongsDB.getAll().map((song) => ({
        key: song.videoId,
        videoId: song.videoId,
        title: song.title,
      }));
      this.setState({ songs: songs });
    });
  }

  _onPressMoreInfo = (videoId, title, thumbnail) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Add to Playlist', 'Delete'],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 2,
      title: title,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        const playlists = PlaylistsDB.getAll();
        const playlistTitles = playlists.map((playlist) => playlist.title);
        ActionSheetIOS.showActionSheetWithOptions({
          options: [...playlistTitles, 'Cancel'],
          cancelButtonIndex: playlistTitles.length,
          title: 'Add to playlist',
          tintColor: 'black',
        }, (index) => {
          if (index < playlistTitles.length) {
            const playlistId = playlists[index].playlistId;
            PlaylistsDB.addSong(playlistId, videoId);
          }
        });
      } else if (index == 2) {
        removeSong(videoId)
          .then(() => console.log('song successfully deleted!'));
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
        this.props.player.play();
      }
      return;
    }

    this.props.player.loadLocal(videoId)
      .then(() => {
        this.props.playerPlay();
        this.props.player.play();
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

    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <SavedSongsView
          songs={this.state.songs}
          onPressPlay={this._onPressPlay}
          onPressMoreInfo={this._onPressMoreInfo}
          videoIdPlaying={this.props.currentlyPlaying.videoId}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
        <PlaybackCompletion/>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    player: state.player,
    playingStatus: state.playingStatus,
    currentlyPlaying: state.currentlyPlaying,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedSongs);
