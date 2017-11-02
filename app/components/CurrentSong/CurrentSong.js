import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import Icon from 'react-native-vector-icons/Foundation';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Slider,
} from 'react-native';

import { onPlayEnd } from '../../lib/player';

class CurrentSong extends Component {
  static navigatorStyle = {
    disabledBackGesture: true,
  };

  state = {
    isSliding: false,
    sliderValue: null,
    interval: null,
  }

  constructor(props) {
    super(props);

    const interval = setInterval(() => {
      const { sound } = this.props.player;
      sound.getCurrentTime((seconds) => {
        if (!this.state.isSliding) {
          this.setState({
            sliderValue: seconds / sound.getDuration(),
          });
        }
      });
    }, 250);

    this.state.interval = interval;
  }

  _onPressPlayPause = () => {
    if (this.props.playingStatus) {
      this.props.playerPause();
      this.props.player.sound.pause();
    } else {
      this.props.playerPlay();
      this.props.player.sound.play(onPlayEnd.bind(this));
    }
  }

  _onSeeking = (value) => {
    this.setState({ isSliding: true });
  }

  // This callback is called after the last _onSeeking(), so there should
  // be no race conditions involving isSliding here.
  _onSeekEnd = (value) => {
    const { sound } = this.props.player;
    sound.setCurrentTime(value * sound.getDuration());
    this.setState({ isSliding: false });
  }

  _onPressLoop = () => {
    const { sound } = this.props.player;
    if (sound.getNumberOfLoops() == -1) {
      sound.setNumberOfLoops(0);
    } else {
      sound.setNumberOfLoops(-1);
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

        <Slider
          style={{ width: 300 }}
          value={this.state.sliderValue}
          onValueChange={this._onSeeking}
          onSlidingComplete={this._onSeekEnd}
          debugTouchArea={true}
        />

        <TouchableOpacity onPress={this._onPressPlayPause}>
          <Icon size={64} name={this.props.playingStatus ? 'pause' : 'play'}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._onPressLoop}>
          <Icon size={64} name='loop'/>
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
