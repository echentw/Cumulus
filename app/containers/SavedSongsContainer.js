import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import RNFS from 'react-native-fs';
import { getSongs } from '../db/realm';

import SavedSongs from '../components/SavedSongs';

class SavedSongsContainer extends Component {
  constructor(props) {
    super(props);

    const songs = getSongs().map((song) => ({
      key: song.videoId,
      videoId: song.videoId,
      title: song.title,
    }));

    this.state = {
      songs: songs,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'DeepLink') {
      this.props.navigator.resetTo({
        screen: event.link,
        animated: true,
        animationType: 'fade',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    }
  }

  render() {
    return (
      <SavedSongs songs={this.state.songs}/>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedSongsContainer);
