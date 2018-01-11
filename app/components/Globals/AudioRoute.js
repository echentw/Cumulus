import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import {
  NativeModules,
  NativeEventEmitter,
  View,
} from 'react-native';

const { AudioRouteManager } = NativeModules;
const emitter = new NativeEventEmitter(AudioRouteManager);

class AudioRoute extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.subscription = emitter.addListener('proximityStateDidChange', ({ proximity }) => {
      if (this.props.player.isReady() && this.props.playingStatus) {
        this.props.playerPause();
        this.props.player.pause();
        console.log('pausing the player');
      } else {
        console.log('nothing is playing right now');
      }
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    return <View/>;
  }
}

function mapStateToProps(state) {
  return {
    currentlyPlaying: state.currentlyPlaying,
    player: state.player,
    playingStatus: state.playingStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioRoute);
