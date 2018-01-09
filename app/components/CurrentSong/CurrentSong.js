import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import ActionSheet from '../../lib/actionsheets';
import { progressToDisplay } from '../../lib/utils';

import SongsDB from '../../db/SongsDB';
import PlaylistsDB from '../../db/PlaylistsDB';

import CurrentSongView from './CurrentSongView';

class CurrentSong extends Component {
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

      playlistTitle: null,
    };

    if (props.currentlyPlaying.playlistId != null) {
      this.state.playlistTitle = PlaylistsDB.getPlaylist(props.currentlyPlaying.playlistId).title;
    } else {
      this.state.playlistTitle = null;
    }
  }

  componentDidMount() {
    const { player } = this.props;
    const interval = setInterval(() => {
      if (player.isReady()) {
        player.getCurrentTime().then((seconds) => {
          if (!this.state.isSliding) {
            this.setState({
              sliderValue: seconds,
              songProgress: progressToDisplay(seconds, player.getDuration()),
            });
          }
        });
      }
    }, 250);
    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentWillUpdate(nextProps, nextState) {
    const currentPlaylistId = this.props.currentlyPlaying.playlistId;
    const nextPlaylistId = nextProps.currentlyPlaying.playlistId;
    if (currentPlaylistId != nextPlaylistId) {
      const playlistTitle = (nextPlaylistId != null) ? PlaylistsDB.getPlaylist(nextPlaylistId).title : null;
      this.setState({ playlistTitle: playlistTitle });
    }
  }

  _onPressMoreInfo = () => {
    const { videoId, songTitle, songThumbnail } = this.props.currentlyPlaying;

    if (SongsDB.exists(videoId)) {
      ActionSheet.savedSongMinimalOptions(videoId, songTitle, songThumbnail);
    } else {
      ActionSheet.searchResultOptions(videoId, songTitle, songThumbnail);
    }
  }

  _onPressPlayPause = () => {
    if (!this.props.player.isReady()) {
      return;
    }
    if (this.props.playingStatus) {
      this.props.playerPause();
      this.props.player.pause();
    } else {
      this.props.playerPlay();
      this.props.player.play();
    }
  }

  _onSeeking = (value) => {
    if (!this.props.player.isReady()) {
      return;
    }
    this.setState({
      isSliding: true,
      songProgress: progressToDisplay(value, this.props.player.getDuration()),
    });
  }

  // This callback is called after the last _onSeeking(), so there should
  // be no race conditions involving isSliding here.
  _onSeekEnd = (seconds) => {
    if (!this.props.player.isReady()) {
      return;
    }
    this.props.player.setCurrentTime(seconds);
    this.setState({ isSliding: false });
  }

  _onPressLoop = () => {
    if (!this.props.player.isReady()) {
      return;
    }
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
    if (playlistId == null) return;

    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const songs = playlist.songs.sorted('title');
    let nextSong;
    if (this.props.currentlyPlaying.shuffleOrder == null) {
      const index = songs.findIndex((song) => song.videoId == videoId);
      const nextIndex = (index - 1 + songs.length) % songs.length;
      nextSong = songs[nextIndex];
    } else {
      const { shuffleOrder } = this.props.currentlyPlaying;
      const index = shuffleOrder.findIndex((song) => song.videoId == videoId);
      const nextIndex = (index - 1 + shuffleOrder.length) % shuffleOrder.length;
      nextSong = shuffleOrder[nextIndex];
    }

    this.props.setCurrentlyPlaying({
      playlistId: playlistId,
      videoId: nextSong.videoId,
      songTitle: nextSong.title,
      songThumbnail: nextSong.thumbnail,
    });

    this.props.player.loadLocal(nextSong.videoId)
      .then(() => {
        if (this.props.playingStatus) {
          this.props.player.play()
        }
      })
      .catch((error) => console.log(error));
  }

  _onPressNextSong = () => {
    const { playlistId, videoId } = this.props.currentlyPlaying;
    if (playlistId == null) return;

    const playlist = PlaylistsDB.getPlaylist(playlistId);
    const songs = playlist.songs.sorted('title');
    let nextSong;
    if (this.props.currentlyPlaying.shuffleOrder == null) {
      const index = songs.findIndex((song) => song.videoId == videoId);
      const nextIndex = (index + 1) % songs.length;
      nextSong = songs[nextIndex];
    } else {
      const { shuffleOrder } = this.props.currentlyPlaying;
      const index = shuffleOrder.findIndex((song) => song.videoId == videoId);
      const nextIndex = (index + 1) % shuffleOrder.length;
      nextSong = shuffleOrder[nextIndex];
    }

    this.props.setCurrentlyPlaying({
      playlistId: playlistId,
      videoId: nextSong.videoId,
      songTitle: nextSong.title,
      songThumbnail: nextSong.thumbnail,
    });

    this.props.player.loadLocal(nextSong.videoId)
      .then(() => {
        if (this.props.playingStatus) {
          this.props.player.play();
        }
      })
      .catch((error) => console.log(error));
  }

  _shufflePlaylist = () => {
    const { playlistId } = this.props.currentlyPlaying;
    if (playlistId == null) return;

    const playlist = PlaylistsDB.getPlaylist(playlistId);
    this.props.togglePlaylistShuffle(playlist.songs);
  }

  render() {
    return (
      <CurrentSongView
        title={this.props.currentlyPlaying.songTitle}
        playingPlaylist={this.props.currentlyPlaying.playlistId != null}
        playlistIsShuffling={this.props.currentlyPlaying.shuffleOrder != null}
        playlistTitle={this.state.playlistTitle}
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
        onPressShufflePlaylist={this._shufflePlaylist}
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
