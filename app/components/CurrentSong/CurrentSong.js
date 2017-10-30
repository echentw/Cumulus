import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import Icon from 'react-native-vector-icons/Foundation';

import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

class CurrentSong extends Component {
  _onPressPlayPause = () => {
    if (this.props.playingStatus) {
      this.props.playerPause();
      this.props.player.sound.pause();
    } else {
      this.props.playerPlay();
      this.props.player.sound.play();
    }
  }

  render() {
    if (!this.props.title) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No song playing</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>You are currently listening to {this.props.title}</Text>
        <TouchableOpacity onPress={this._onPressPlayPause}>
          <Icon size={64} name={this.props.playingStatus ? 'pause' : 'play'}/>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    title: state.currentSongInfo.title,
    thumbnail: state.currentSongInfo.thumbnail,
    player: state.player,
    playingStatus: state.playingStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSong);
