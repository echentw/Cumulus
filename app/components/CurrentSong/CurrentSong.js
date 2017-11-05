import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { onPlayEnd } from '../../lib/player';

import CurrentSongView from './CurrentSongView';

class CurrentSong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSliding: false,
      sliderValue: 0,

      // We use this to render the looping icon instead of sound.getNumberOfLoops()
      // because this gives more immediate feedback.
      isLooping: props.player.sound ? (props.player.sound.getNumberOfLoops() == -1) : false,

      // Used for updating the slider as the music progresses.
      interval: null,
    };
  }

  componentDidMount() {
    const { sound } = this.props.player;
    if (sound) {
      const interval = setInterval(() => {
        sound.getCurrentTime((seconds) => {
          if (!this.state.isSliding) {
            this.setState({
              sliderValue: seconds / sound.getDuration(),
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

  _enableDrawer = () => this.props.navigator.setDrawerEnabled({ side: 'left', enabled: true });
  _disableDrawer = () => this.props.navigator.setDrawerEnabled({ side: 'left', enabled: false });

  _onPressMoreInfo = () => {
    this.props.songInfoFocus(this.props.videoId, this.props.title, this.props.thumbnail);
    this._disableDrawer();
    this.props.navigator.showLightBox({
      screen: 'Cumulus.SongOptions',
      passProps: {
        enableDrawer: this._enableDrawer,
      },
      style: {
        backgroundBlur: 'light',
        backgroundColor: '#88888820',
        tapBackgroundToDismiss: true,
      },
    });
  }

  _onPressPlayPause = () => {
    if (this.props.playingStatus) {
      this.props.playerPause();
      this.props.player.sound.pause();
    } else {
      this.props.playerPlay();
      this.props.player.sound.play(onPlayEnd.bind(this));
    }
  }

  _onSeeking = (value) => {
    this.setState({ isSliding: true });
  }

  // This callback is called after the last _onSeeking(), so there should
  // be no race conditions involving isSliding here.
  _onSeekEnd = (value) => {
    const { sound } = this.props.player;
    sound.setCurrentTime(value * sound.getDuration());
    this.setState({ isSliding: false });
  }

  _onPressLoop = () => {
    const { sound } = this.props.player;
    if (sound.getNumberOfLoops() == -1) {
      sound.setNumberOfLoops(0);
      this.setState({ isLooping: false });
    } else {
      sound.setNumberOfLoops(-1);
      this.setState({ isLooping: true });
    }
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
