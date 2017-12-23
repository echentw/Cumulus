import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';

import PlaylistsDB from '../../db/PlaylistsDB';
import { LoopStatus } from '../../constants';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import PlaylistView from './PlaylistView';

class Playlist extends Component {
  constructor(props) {
    super(props);
    if (!this.props.player) {
      this.props.initializePlayer();
    }

    const playlist = PlaylistsDB.getPlaylist(props.playlistId);
    const songs = playlist.songs.sorted('title').map((song) => ({
      key: song.videoId,
      videoId: song.videoId,
      title: song.title,
    }));
    this.state = { songs: songs };
  }

  _onPressMoreInfo = (videoId, title, thumbnail) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Add to playlist', 'Remove from this playlist'],
      cancelButtonIndex: 0,
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
          const playlistId = playlists[index].playlistId;
          PlaylistsDB.addSong(playlistId, videoId);
        });
      } else if (index == 2) {
        PlaylistsDB.removeSong(this.props.playlistId, videoId);
      }
    });
  }

  _onPressPlay = (videoId, songTitle, songThumbnail) => {
    if (this.props.currentlyPlaying.playlistId != this.props.playlistId) {
      // Holy smokes this is a horrible hack.
      // Basically we need to make sure that the songs in the shuffle order
      // are updated to be songs of this playlist.
      const playlist = PlaylistsDB.getPlaylist(this.props.playlistId);
      this.props.togglePlaylistShuffle(playlist.songs);
      this.props.togglePlaylistShuffle(playlist.songs);
    }

    this.props.setCurrentlyPlaying({
      playlistId: this.props.playlistId,
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

  _songsOnChangeCallback = () => {
    const playlist = PlaylistsDB.getPlaylist(this.props.playlistId);
    const songs = playlist.songs.sorted('title').map((song) => ({
      key: song.videoId,
      videoId: song.videoId,
      title: song.title,
    }));
    this.setState({ songs: songs });
  }

  componentDidMount() {
    PlaylistsDB.addOnChangeListener(this._songsOnChangeCallback);
  }

  componentWillUnmount() {
    PlaylistsDB.removeOnChangeListener(this._songsOnChangeCallback);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <PlaylistView
          songs={this.state.songs}
          onPressPlay={this._onPressPlay}
          onPressMoreInfo={this._onPressMoreInfo}
          videoIdPlaying={this.props.currentlyPlaying.videoId}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
      </View>
    );
  }
}

Playlist.propTypes = {
  playlistId: PropTypes.string.isRequired,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
