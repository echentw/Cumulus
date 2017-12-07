import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View } from 'react-native';
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
    console.log('you pressed more info');
  }

  _onPressPlay = (videoId, title, thumbnail) => {
    console.log('you pressed play');
  }

  componentDidMount() {
    PlaylistsDB.addOnChangeListener(() => {
      const playlist = PlaylistsDB.getPlaylist(props.playlistId);
      const songs = playlist.songs.map((song) => ({
        key: song.videoId,
        videoId: song.videoId,
        title: song.title,
      }));
      this.setState({ songs: songs });
    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <PlaylistView
          songs={this.state.songs}
          onPressPlay={this._onPressPlay}
          onPressMoreInfo={this._onPressMoreInfo}
          videoIdPlaying={this.props.currentSongInfo.videoId}
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
    currentSongInfo: state.currentSongInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
