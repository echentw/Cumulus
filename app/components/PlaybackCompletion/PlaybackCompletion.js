import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View } from 'react-native';

import PlaylistsDB from '../../db/PlaylistsDB';

// This is a component that is mounted forever and doesn't render anything to the UI.
// The purpose is to maintain a global state of which playlist is playing,
// and to properly play the next song in the playlist when the current song is finished
// playing.
class PlaybackCompletion extends Component {
  constructor(props) {
    super(props);
  }

  _pauseSong = () => {
    this.props.playerPause();
  }

  _playNextSong = ({ playlistId, videoId }) => {
    if (playlistId == null) {
      this._pauseSong();
      return;
    }

    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const songs = playlist.songs.sorted('title');
    const index = songs.findIndex((song) => song.videoId == videoId);
    const nextIndex = (index + 1) % songs.length;
    const nextSong = songs[nextIndex];

    this.props.setCurrentlyPlaying({
      playlistId: playlistId,
      videoId: nextSong.videoId,
      songTitle: nextSong.title,
      songThumbnail: nextSong.thumbnail,
    });

    this.props.player.loadLocal(nextSong.videoId)
      .then(() => this.props.player.play())
      .catch((error) => console.log(error));
  }

  componentWillUpdate(nextProps, nextState) {
    const { currentlyPlaying } = nextProps;
    const { playlistId } = currentlyPlaying;
    const callback = playlistId ? (() => this._playNextSong(currentlyPlaying)) : (() => this._pauseSong());
    this.props.player.setOnCompleteCallback(callback);
  }

  render() {
    return <View/>;
  }
}

function mapStateToProps(state) {
  return {
    currentlyPlaying: state.currentlyPlaying,
    player: state.player,
    playingStatus: state.playingStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackCompletion);
