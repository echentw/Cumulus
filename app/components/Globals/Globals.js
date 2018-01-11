import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View } from 'react-native';

import PlaybackCompletion from './PlaybackCompletion';
import AudioRoute from './AudioRoute';

// This is a component that is mounted forever and doesn't render anything to the UI.
export default class Globals extends Component {
  render() {
    return (
      <View>
        <PlaybackCompletion/>
        <AudioRoute/>
      </View>
    );
  }
}
