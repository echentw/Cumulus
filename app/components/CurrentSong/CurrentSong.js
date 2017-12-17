import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { ActionSheetIOS } from 'react-native';

import { downloadSong } from '../../lib/songManagement';
import { progressToDisplay } from '../../lib/utils';
import PlaylistsDB from '../../db/PlaylistsDB';

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

  _onPressReplayFiveSec = () => {
    const newSeconds = Math.max(0, this.state.sliderValue - 5);
    this.props.player.setCurrentTime(newSeconds);
    this.setState({ sliderValue: newSeconds });
  }

  _onPressForwardFiveSec = () => {
    const songDuration = this.props.player.getDuration();

    // Two second margin to prevent some boundary case bugs.
    // If you fast forward to the end of the song, the song will repeat even if
    // repeat is not toggled.
    const newSeconds = Math.min(songDuration - 2, this.state.sliderValue + 5);
    this.props.player.setCurrentTime(newSeconds);
    this.setState({ sliderValue: newSeconds });
  }

  _onPressPreviousSong = () => {
    const { playlistId, videoId } = this.props.currentlyPlaying;
    if (playlistId == null) {
      return;
    }

    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const index = playlist.songs.findIndex((song) => song.videoId == videoId);
    const nextIndex = (index - 1 + playlist.songs.length) % playlist.songs.length;
    const nextSong = playlist.songs[nextIndex];

    this.props.setCurrentlyPlaying({
      playlistId: playlistId,
      videoId: nextSong.videoId,
      songTitle: nextSong.title,
      songThumbnail: nextSong.thumbnail,
    });

    this.props.player.loadLocal(nextSong.videoId)
      .then(() => this.props.player.play(this._onPressNextSong))
      .catch((error) => console.log(error));
  }

  _onPressNextSong = () => {
    const { playlistId, videoId } = this.props.currentlyPlaying;
    if (playlistId == null) {
      return;
    }

    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const index = playlist.songs.findIndex((song) => song.videoId == videoId);
    const nextIndex = (index + 1) % playlist.songs.length;
    const nextSong = playlist.songs[nextIndex];

    this.props.setCurrentlyPlaying({
      playlistId: playlistId,
      videoId: nextSong.videoId,
      songTitle: nextSong.title,
      songThumbnail: nextSong.thumbnail,
    });

    this.props.player.loadLocal(nextSong.videoId)
      .then(() => this.props.player.play(this._onPressNextSong))
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <CurrentSongView
        title={this.props.currentlyPlaying.songTitle}
        playingPlaylist={this.props.currentlyPlaying.playlistId != null}
        playingStatus={this.props.playingStatus}
        isLooping={this.state.isLooping}
        sliderValue={this.state.sliderValue}
        sliderMaxValue={this.props.player.isReady() ? this.props.player.getDuration() : 1}
        songProgress={this.state.songProgress}
        onPressPlayPause={this._onPressPlayPause}
        onPressLoop={this._onPressLoop}
        onPressReplayFiveSec={this._onPressReplayFiveSec}
        onPressForwardFiveSec={this._onPressForwardFiveSec}
        onSeeking={this._onSeeking}
        onSeekEnd={this._onSeekEnd}
        onPressMoreInfo={this._onPressMoreInfo}
        onPressPreviousSong={this._onPressPreviousSong}
        onPressNextSong={this._onPressNextSong}
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
