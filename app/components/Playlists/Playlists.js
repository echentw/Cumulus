import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View } from 'react-native';

import ActionSheet from '../../lib/actionsheets';
import PlaylistsDB from '../../db/PlaylistsDB';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import PlaylistsView from './PlaylistsView';

class Playlists extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: '+',
        id: 'add-playlist',
        buttonColor: 'rgb(230, 230, 230)',
        buttonFontSize: 24,
        buttonFontWeight: '600',
      },
    ],
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress' && event.id == 'add-playlist') {
      ActionSheet.newPlaylist();
    }
  }

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    const playlists = PlaylistsDB.getAll().map((playlist) => ({
      key: playlist.playlistId,
      playlistId: playlist.playlistId,
      title: playlist.title,
    }));
    this.state = { playlists: playlists };
  }

  componentDidMount() {
    PlaylistsDB.addOnChangeListener(() => {
      const playlists = PlaylistsDB.getAll().map((playlist) => ({
        key: playlist.playlistId,
        playlistId: playlist.playlistId,
        title: playlist.title,
      }));
      this.setState({ playlists: playlists });
    });
  }

  _onPress = (playlistId, title) => {
    this.props.navigator.push({
      screen: 'Cumulus.Playlist',
      title: 'Playlist',
      animated: true,
      animationType: 'slide-horizontal',
      title: title,
      passProps: {
        playlistId: playlistId,
      },
    });
  }

  _onPressOptions = (playlistId, playlistTitle) => {
    ActionSheet.playlistOptions(playlistId, playlistTitle);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <PlaylistsView
          playlists={this.state.playlists}
          onPress={this._onPress}
          onPressOptions={this._onPressOptions}
        />
        <CurrentSongFooter navigator={this.props.navigator}/>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists);
