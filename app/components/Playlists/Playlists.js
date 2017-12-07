import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View, ActionSheetIOS, AlertIOS } from 'react-native';

import PlaylistsDB from '../../db/PlaylistsDB';

import CurrentSongFooter from '../CurrentSongFooter/CurrentSongFooter';
import PlaylistsView from './PlaylistsView';

class Playlists extends Component {
  constructor(props) {
    super(props);
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

  _onPressOptions = (playlistId, title) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Delete'],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      title: title,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        PlaylistsDB.delete(playlistId);
      }
    });
  }

  _onPressNewPlaylist = () => {
    AlertIOS.prompt(
      'New playlist',
      'Give it a name!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (title) => PlaylistsDB.create(title) },
      ],
      'plain-text', // text input type
      '', // default text in text input
      'default', // keyboard type
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <PlaylistsView
          playlists={this.state.playlists}
          onPress={this._onPress}
          onPressOptions={this._onPressOptions}
          onPressNewPlaylist={this._onPressNewPlaylist}
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
