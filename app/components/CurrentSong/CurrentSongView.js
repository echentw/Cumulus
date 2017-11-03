import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Slider,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Foundation';

class CurrentSongView extends Component {
  render() {
    if (!this.props.title) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No song playing</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text>You are currently listening to {this.props.title}</Text>

        <Slider
          style={{ width: 300 }}
          value={this.props.sliderValue}
          onValueChange={this.props.onSeeking}
          onSlidingComplete={this.props.onSeekEnd}
          debugTouchArea={true}
        />

        <TouchableOpacity onPress={this.props.onPressPlayPause}>
          <Icon size={64} name={this.props.playingStatus ? 'pause' : 'play'}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.props.onPressLoop}>
          <Icon size={64} name='loop' style={ this.props.isLooping ? styles.looping : styles.nonlooping }/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  looping: {
    color: 'lightgreen',
  },
  nonlooping: {
    color: 'black',
  }
});

CurrentSongView.propTypes = {
  title: PropTypes.string,
  playingStatus: PropTypes.bool.isRequired,
  isLooping: PropTypes.bool.isRequired,
  sliderValue: PropTypes.number.isRequired,
  onPressPlayPause: PropTypes.func.isRequired,
  onPressLoop: PropTypes.func.isRequired,
  onSeeking: PropTypes.func.isRequired,
  onSeekEnd: PropTypes.func.isRequired,
};

export default CurrentSongView;
