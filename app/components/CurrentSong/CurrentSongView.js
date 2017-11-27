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
import EIcon from 'react-native-vector-icons/Entypo';

class CurrentSongView extends Component {
  render() {
    if (!this.props.title) {
      return (
        <View style={styles.container}>
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
          maximumValue={this.props.sliderMaxValue}
          onValueChange={this.props.onSeeking}
          onSlidingComplete={this.props.onSeekEnd}
          debugTouchArea={true}
        />

        <Text>{this.props.songProgress}</Text>

        <TouchableOpacity onPress={this.props.onPressPlayPause}>
          <Icon size={64} name={this.props.playingStatus ? 'pause' : 'play'}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.props.onPressLoop}>
          <Icon size={64} name='loop' style={ this.props.isLooping ? styles.looping : styles.nonlooping }/>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: 'center', width: 50, marginTop: 20 }}
          onPress={() => this.props.onPressMoreInfo(this.props.videoId, this.props.title, this.props.thumbnail)}
        >
          <EIcon size={36} name='dots-three-vertical'/>
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
    backgroundColor: 'rgb(230, 230, 230)',
  },
  looping: {
    color: 'lightblue',
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
  sliderMaxValue: PropTypes.number.isRequired,
  songProgress: PropTypes.string.isRequired,

  onPressPlayPause: PropTypes.func.isRequired,
  onPressLoop: PropTypes.func.isRequired,
  onSeeking: PropTypes.func.isRequired,
  onSeekEnd: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
};

export default CurrentSongView;
