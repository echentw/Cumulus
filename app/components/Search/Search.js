import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { View } from 'react-native';

import youtubeSearch from '../../lib/youtubeSearch';
import { downloadVideoToServer } from '../../lib/serverRequest.js';
import Player from '../../lib/Player';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import SearchView from './SearchView';

class Search extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    if (!this.props.player) {
      this.props.initializePlayer();
    }
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

  _enableDrawer = () => this.props.navigator.setDrawerEnabled({ side: 'left', enabled: true });
  _disableDrawer = () => this.props.navigator.setDrawerEnabled({ side: 'left', enabled: false });

  _onPressMoreInfo = (videoId, title, thumbnail) => {
    this.props.songInfoFocus(videoId, title, thumbnail);
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
    this.props.setCurrentSongInfo(videoId, title, thumbnail);

    if (videoId == this.props.player.videoId) {
      if (this.props.playingStatus) {
        this.props.playerPause();
        this.props.player.pause();
      } else {
        this.props.playerPlay();
        this.props.player.play(() => this.props.playerPause());
      }
      return;
    }

    downloadVideoToServer(videoId)
      .then((response) => {
        // TODO: might want to figure out how to deal with error here
        return this.props.player.loadRemote(videoId)
      })
      .then(() => {
        this.props.player.play(() => this.props.playerPause());
        this.props.playerPlay();
      })
      .catch((error) => console.log(error));
  }

  render() {
    if (!this.props.player) {
      // TODO: add loading spinner
      return (
        <View>Loading...</View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <SearchView
          defaultSearchQuery={this.props.searchQuery}
          onChangeText={this._onChangeText}
          onSubmitEditing={this._onSubmitEditing}
          searchResults={this.props.searchResults}
          onPressPlay={this._onPressPlay}
          videoIdPlaying={this.props.player.videoId}
          onPressMoreInfo={this._onPressMoreInfo}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
      </View>
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
