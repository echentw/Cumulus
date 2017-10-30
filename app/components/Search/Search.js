import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import Sound from 'react-native-sound';
Sound.setCategory('Playback');

import youtubeSearch from '../../lib/youtubeSearch';
import { downloadVideoToServer, getAudioUrl } from '../../lib/serverRequest.js';

import SearchView from './SearchView';

class Search extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'DeepLink') {
      this.props.navigator.resetTo({
        screen: event.link,
        animated: true,
        animationType: 'fade',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    }
  }

  _setPlayer = (videoId, sound) => {
    if (this.props.player.sound) {
      this.props.player.sound.stop(() => {
        this.props.player.sound.release();
        this.props.setPlayer(videoId, sound);
        this.props.playerPlay();
      });
    } else {
      this.props.setPlayer(videoId, sound);
      this.props.playerPlay();
    }
  }

  _onChangeText = (text) => {
    this.props.updateSearchQuery(text);
  }

  _onSubmitEditing = () => {
    youtubeSearch(this.props.searchQuery, this.props.user.token)
      .then((response) => {
        const blob = JSON.parse(response._bodyText);
        const results = blob.items.map((result) => ({
          key: result.id.videoId,
          videoId: result.id.videoId,
          title: result.snippet.title,
          thumbnail: {
            url: result.snippet.thumbnails.high.url,
            height: result.snippet.thumbnails.high.height,
            width: result.snippet.thumbnails.high.width,
          },
        }));
        this.props.updateSearchResults(results);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _onPressPlay = (videoId, title, thumbnail) => {
    this.props.setCurrentSongInfo(title, thumbnail);

    if (videoId == this.props.player.videoId) {
      if (this.props.playingStatus) {
        this.props.playerPause();
        this.props.player.sound.pause();
      } else {
        this.props.playerPlay();
        this.props.player.sound.play();
      }
      return;
    }

    downloadVideoToServer(videoId)
      .then((response) => {
        const url = getAudioUrl(videoId);
        const sound = new Sound(url, null, (error) => {
          if (error) {
            console.log('failed to load sound', error);
            return;
          }
          sound.setNumberOfLoops(-1);
          sound.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        });
        this._setPlayer(videoId, sound);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <SearchView
        defaultSearchQuery={this.props.searchQuery}
        onChangeText={this._onChangeText}
        onSubmitEditing={this._onSubmitEditing}
        searchResults={this.props.searchResults}
        onPressPlay={this._onPressPlay}
        videoIdPlaying={this.props.player.videoId}
        onPressMoreInfo={this.props.songInfoFocus}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    player: state.player,
    playingStatus: state.playingStatus,
    searchQuery: state.searchQuery,
    searchResults: state.searchResults,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
