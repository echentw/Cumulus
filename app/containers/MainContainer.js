import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import { Text } from 'react-native';

import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import Main from '../components/Main';

class MainContainer extends Component {
  constructor(props) {
    super(props);

    const sound = new Sound('snow-halation.mp3', Sound.MAIN_BUNDLE, (error) => {
      sound.setNumberOfLoops(-1);

      if (error) {
        console.log('failed to load sound', error);
        return;
      }

      sound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
          if (sound.getNumberOfLoops() != -1) {
            this.setState({playing: false});
          }
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });

    this.state = {
      sound: sound,
      playing: true,
    };

    this._onPressPlayPauseButton = this._onPressPlayPauseButton.bind(this);
  }

  _onPressPlayPauseButton() {
    this.setState({playing: !this.state.playing});
    if (this.state.playing) {
      this.state.sound.pause();
    } else {
      this.state.sound.play();
    }
  }

  render() {
    return (
      <Main {...this.props} onPressPlayPauseButton={this._onPressPlayPauseButton}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
