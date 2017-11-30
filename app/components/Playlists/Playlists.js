import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import PlaylistsDB from '../../db/PlaylistsDB';

import PlaylistsView from './PlaylistsView';

class Playlists extends Component {
  constructor(props) {
    super(props);
    const playlists = PlaylistsDB.getAll();
    this.state = { playlists: playlists };
  }

  render() {
    return (
      <PlaylistsView
        playlists={this.state.playlists}
      />
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists);
