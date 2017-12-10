import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { ActionSheetIOS } from 'react-native';

import { downloadSong } from '../../lib/songManagement';
import { progressToDisplay } from '../../lib/utils';

import CurrentSongView from './CurrentSongView';

class CurrentSong extends Component {
  static navigatorStyle = {
    disabledBackGesture: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isSliding: false,
      sliderValue: 0,
      songProgress: progressToDisplay(0, 0),

      // We use this to render the looping icon instead of sound.getNumberOfLoops()
      // because this gives more immediate feedback.
      isLooping: props.player.isReady() ? props.player.isLooping() : false,

      // Used for updating the slider as the music progresses.
      interval: null,
    };
  }

  componentDidMount() {
    const { player } = this.props;
    if (player.isReady()) {
      const interval = setInterval(() => {
        player.getCurrentTime().then((seconds) => {
          if (!this.state.isSliding) {
            this.setState({
              sliderValue: seconds,
              songProgress: progressToDisplay(seconds, player.getDuration()),
            });
          }
        });
      }, 250);
      this.setState({ interval: interval });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  _onPressMoreInfo = () => {
    const { videoId, songTitle, songThumbnail } = this.props.currentlyPlaying;
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Download', 'Add to Playlist'],
      cancelButtonIndex: 0,
      title: songTitle,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        downloadSong(videoId, songTitle, songThumbnail)
          .then(() => console.log('done writing to db!'))
          .catch((err) => console.log('an error happened', err));
      } else if (index == 2) {
        console.log('you want to add this to a playlist hmmm');
      }
    });
  }

  _onPressPlayPause = () => {
    if (this.props.playingStatus) {
      this.props.playerPause();
      this.props.player.pause();
    } else {
      this.props.playerPlay();
      this.props.player.play(() => this.props.playerPause());
    }
  }

  _onSeeking = (value) => {
    this.setState({
      isSliding: true,
      songProgress: progressToDisplay(value, this.props.player.getDuration()),
    });
  }

  // This callback is called after the last _onSeeking(), so there should
  // be no race conditions involving isSliding here.
  _onSeekEnd = (seconds) => {
    this.props.player.setCurrentTime(seconds);
    this.setState({ isSliding: false });
  }

  _onPressLoop = () => {
    const shouldLoop = !this.props.player.isLooping();
    this.props.player.setLoop(shouldLoop);
    this.setState({ isLooping: shouldLoop });
  }

  render() {
    return (
      <CurrentSongView
        title={this.props.currentlyPlaying.songTitle}
        playingStatus={this.props.playingStatus}
        isLooping={this.state.isLooping}
        sliderValue={this.state.sliderValue}
        sliderMaxValue={this.props.player.isReady() ? this.props.player.getDuration() : 1}
        songProgress={this.state.songProgress}
        onPressPlayPause={this._onPressPlayPause}
        onPressLoop={this._onPressLoop}
        onSeeking={this._onSeeking}
        onSeekEnd={this._onSeekEnd}
        onPressMoreInfo={this._onPressMoreInfo}
      />
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSong);
