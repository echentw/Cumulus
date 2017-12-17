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
import MIcon from 'react-native-vector-icons/MaterialIcons';

class CurrentSongView extends Component {
  _buttonView = (element, onPressFunction, asdf) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={onPressFunction}>
          {element}
        </TouchableOpacity>
      </View>
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

    const rewindElement = <MIcon size={36} name='replay-5'/>;
    const ffElement = <MIcon size={36} name='forward-5'/>;
    const previousElement = <Icon size={48} name='previous'/>;
    const nextElement = <Icon size={48} name='next'/>;

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
          <View style={styles.bottomTop}>
            { this._buttonView(previousElement, () => console.log('previous')) }
            { this._buttonView(rewindElement, () => console.log('rewind')) }
            { this._buttonView(playPauseElement, this.props.onPressPlayPause) }
            { this._buttonView(ffElement, () => console.log('ff')) }
            { this._buttonView(nextElement, () => console.log('next')) }
          </View>
          <View style={styles.bottomBottom}>
            { this._buttonView(loopElement, this.props.onPressLoop) }
            { this._buttonView(moreOptionsElement, () => this.props.onPressMoreInfo(videoId, title, thumbnail)) }
          </View>
          <View style={styles.bottomPadding}/>
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
    flexDirection: 'column',
  },
  bottomTop: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bottomPadding: {
    flex: 2,
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
