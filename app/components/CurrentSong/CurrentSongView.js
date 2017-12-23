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

function Titles({ title, playingPlaylist, playlistTitle }) {
  const styles = {
    container: {
      marginBottom: 10,
    },
    text: {
      fontSize: 14,
    },
  };

  if (playingPlaylist) {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ ...styles.text, fontWeight: 'bold' }}>Playlist</Text>
          <Text style={styles.text}>{playlistTitle}</Text>
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
      </View>
    );
  }
}

class CurrentSongView extends Component {
  _buttonView = (element, onPressFunction) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={onPressFunction}>
          {element}
        </TouchableOpacity>
      </View>
    );
  }

  _topButtons = (playingPlaylist) => {
    const playPauseElement = (
      <Icon size={64} name={this.props.playingStatus ? 'pause' : 'play'}/>
    );
    const rewindElement = <MIcon size={36} name='replay-5'/>;
    const ffElement = <MIcon size={36} name='forward-5'/>;

    if (playingPlaylist) {
      const previousElement = <Icon size={48} name='previous'/>;
      const nextElement = <Icon size={48} name='next'/>;
      return (
        <View style={styles.bottomTop}>
          { this._buttonView(previousElement, this.props.onPressPreviousSong) }
          { this._buttonView(rewindElement, this.props.onPressReplayFiveSec) }
          { this._buttonView(playPauseElement, this.props.onPressPlayPause) }
          { this._buttonView(ffElement, this.props.onPressForwardFiveSec) }
          { this._buttonView(nextElement, this.props.onPressNextSong) }
        </View>
      );
    } else {
      return (
        <View style={styles.bottomTop}>
          <View style={{ flex: 1 }}/>
          { this._buttonView(rewindElement, this.props.onPressReplayFiveSec) }
          { this._buttonView(playPauseElement, this.props.onPressPlayPause) }
          { this._buttonView(ffElement, this.props.onPressForwardFiveSec) }
          <View style={{ flex: 1 }}/>
        </View>
      );
    }
  }

  _bottomButtons = (playingPlaylist) => {
    const bottomButtonsStyles = {
      loop: { color: this.props.isLooping ? 'blue' : 'grey' },
      moreOptions: { paddingTop: 13, paddingBottom: 13 },
      shuffle: { color: this.props.playlistIsShuffling ? 'blue' : 'grey' },
    };

    const loopElement = (
      <Icon size={48} name='loop' style={bottomButtonsStyles.loop}/>
    );
    const moreOptionsElement = (
      <EIcon size={32} name='dots-three-vertical' style={bottomButtonsStyles.moreOptions}/>
    );
    const shuffleElement = (
      <Icon size={48} name='shuffle' style={bottomButtonsStyles.shuffle}/>
    );

    const { videoId, title, thumbnail } = this.props;
    if (playingPlaylist) {
      return (
        <View style={styles.bottomBottom}>
          { this._buttonView(loopElement, this.props.onPressLoop) }
          { this._buttonView(shuffleElement, this.props.onPressShufflePlaylist) }
          { this._buttonView(moreOptionsElement, () => this.props.onPressMoreInfo(videoId, title, thumbnail)) }
        </View>
      );
    } else {
      return (
        <View style={styles.bottomBottom}>
          { this._buttonView(loopElement, this.props.onPressLoop) }
          { this._buttonView(moreOptionsElement, () => this.props.onPressMoreInfo(videoId, title, thumbnail)) }
        </View>
      );
    }
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

    const { videoId, title, thumbnail } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Titles
            title={title}
            playingPlaylist={this.props.playingPlaylist}
            playlistTitle={this.props.playlistTitle}
          />
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
          { this._topButtons(this.props.playingPlaylist) }
          { this._bottomButtons(this.props.playingPlaylist) }
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
  playingPlaylist: PropTypes.bool.isRequired,
  playlistIsShuffling: PropTypes.bool.isRequired,
  playlistTitle: PropTypes.string,
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

  onPressReplayFiveSec: PropTypes.func.isRequired,
  onPressForwardFiveSec: PropTypes.func.isRequired,
  onPressPreviousSong: PropTypes.func.isRequired,
  onPressNextSong: PropTypes.func.isRequired,
  onPressShufflePlaylist: PropTypes.func.isRequired,
};

export default CurrentSongView;
