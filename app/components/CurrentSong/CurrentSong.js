import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { ActionSheetIOS } from 'react-native';

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
              sliderValue: seconds / player.getDuration(),
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
    const { videoId, title, thumbnail } = this.props;
    this.props.songInfoFocus(videoId, title, thumbnail);
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Download', 'Add to Playlist'],
      cancelButtonIndex: 0,
      title: title,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        downloadSong(videoId, title, thumbnail)
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
    this.setState({ isSliding: true });
  }

  // This callback is called after the last _onSeeking(), so there should
  // be no race conditions involving isSliding here.
  _onSeekEnd = (value) => {
    this.props.player.setCurrentTime(value * this.props.player.getDuration());
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
        title={this.props.title}
        playingStatus={this.props.playingStatus}
        isLooping={this.state.isLooping}
        sliderValue={this.state.sliderValue}
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
    videoId: state.currentSongInfo.videoId,
    title: state.currentSongInfo.title,
    thumbnail: state.currentSongInfo.thumbnail,
    player: state.player,
    playingStatus: state.playingStatus,
    currentSongInfo: state.currentSongInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSong);
