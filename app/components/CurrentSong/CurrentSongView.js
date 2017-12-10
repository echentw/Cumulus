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
  _buttonView = (element, onPressFunction) => {
    return (
      <TouchableOpacity
        style={{ margin: 20 }}
        onPress={ onPressFunction }
      >
        { element }
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.props.title) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: 'rgb(230, 230, 230)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text>No song playing</Text>
        </View>
      );
    }

    const loopElement = (
      <Icon size={64} name='loop' style={ this.props.isLooping ? { color: 'lightblue' } : { color: 'black' } }/>
    );
    const playPauseElement = (
      <Icon size={64} name={this.props.playingStatus ? 'pause' : 'play'}/>
    );
    const moreOptionsElement = (
      <EIcon size={36} name='dots-three-vertical' style={{ paddingTop: 13, paddingBottom: 13 }}/>
    );

    const { videoId, title, thumbnail } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Text>{this.props.title}</Text>
          <Text>{this.props.songProgress}</Text>
          <Slider
            style={{ width: 300 }}
            value={this.props.sliderValue}
            maximumValue={this.props.sliderMaxValue}
            onValueChange={this.props.onSeeking}
            onSlidingComplete={this.props.onSeekEnd}
            debugTouchArea={true}
          />
        </View>
        <View style={styles.bottom}>
          { this._buttonView(loopElement, this.props.onPressLoop) }
          { this._buttonView(playPauseElement, this.props.onPressPlayPause) }
          { this._buttonView(moreOptionsElement, () => this.props.onPressMoreInfo(videoId, title, thumbnail)) }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(230, 230, 230)',
  },
  top: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
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
