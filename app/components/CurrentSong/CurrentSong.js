import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import {
  View,
  Text,
} from 'react-native';

class CurrentSong extends Component {
  render() {
    const { title } = this.props;
    const message = title ? `You are currently listening to ${title}` : 'No song playing';
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{message}</Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    title: state.currentSongInfo.title,
    thumbnail: state.currentSongInfo.thumbnail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSong);
