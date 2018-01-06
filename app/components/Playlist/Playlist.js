import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View, ActionSheetIOS, AlertIOS } from 'react-native';
import PropTypes from 'prop-types';

import PlaylistsDB from '../../db/PlaylistsDB';
import SongsDB from '../../db/SongsDB';
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

  _onPressMoreInfo = (videoId, songTitle, thumbnail) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Rename', 'Add to playlist', 'Remove from this playlist'],
      cancelButtonIndex: 0,
      title: songTitle,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        AlertIOS.prompt(
          'Rename song',
          songTitle,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Rename', onPress: (songName) => SongsDB.editTitle(videoId, songName) },
          ],
          'plain-text', // text input type
          '', // default text in text input
          'default', // keyboard type
        );
      } else if (index == 2) {
        const playlists = PlaylistsDB.getAll();
        const playlistTitles = playlists.map((playlist) => playlist.title);
        ActionSheetIOS.showActionSheetWithOptions({
          options: ['+ Create Playlist', ...playlistTitles, 'Cancel'],
          cancelButtonIndex: playlistTitles.length,
          tintColor: 'black',
        }, (index) => {
          if (index == 0) {
            // create new playlist
            AlertIOS.prompt(
              'New playlist',
              'Give it a name!',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Create', onPress: (playlistName) => (function(playlistName) {
                      PlaylistsDB.create(playlistName); 
                      const playlists = PlaylistsDB.getAll();
                      const playlistId = playlists[playlists.length - 1].playlistId;
                      PlaylistsDB.addSong(playlistId, videoId);
                    })(playlistName)
                },
              ],
              'plain-text', // text input type
              '', // default text in text input
              'default', // keyboard type
            );
          } else if (index < playlistTitles.length) {
            const playlistId = playlists[index - 1].playlistId;
            PlaylistsDB.addSong(playlistId, videoId);
          }
        });
      } else if (index == 3) {
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
