import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View, ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';

import PlaylistsDB from '../../db/PlaylistsDB';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import PlaylistView from './PlaylistView';

class Playlist extends Component {
  constructor(props) {
    super(props);
    if (!this.props.player) {
      this.props.initializePlayer();
    }

    const playlist = PlaylistsDB.getPlaylist(props.playlistId);
    const songs = playlist.songs.map((song) => ({
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

  _onPressPlay = (videoId, title, thumbnail) => {
    console.log('you pressed play');
  }

  _songsOnChangeCallback = () => {
    const playlist = PlaylistsDB.getPlaylist(this.props.playlistId);
    const songs = playlist.songs.map((song) => ({
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
    currentlyPlaying: state.currentlyPlaying,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
