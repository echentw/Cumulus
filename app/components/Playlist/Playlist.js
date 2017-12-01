import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import PropTypes from 'prop-types';

import PlaylistsDB from '../../db/PlaylistsDB';

import PlaylistView from './PlaylistView';

class Playlist extends Component {
  constructor(props) {
    super(props);
    const playlist = PlaylistsDB.getPlaylist(props.playlistId);
    const songs = playlist.songs.map((song) => ({
      key: song.videoId,
      videoId: song.videoId,
      title: song.title,
    }));
    this.state = { songs: songs };
  }

  render() {
    return (
      <PlaylistView songs={this.state.songs}/>
    );
  }
}

Playlist.propTypes = {
  playlistId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);
