import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import { View, ActionSheetIOS, AlertIOS } from 'react-native';

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
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'add-playlist') {
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

  _onPressOptions = (playlistId, title) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Rename', 'Delete'],
      cancelButtonIndex: 0,
      destructiveButtonIndex: 2,
      title: title,
      tintColor: 'black',
    }, (index) => {
      if (index == 1) {
        AlertIOS.prompt(
          'Rename playlist',
          title,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Rename', onPress: (playlistName) => PlaylistsDB.editTitle(playlistId, playlistName) },
          ],
          'plain-text', // text input type
          '', // default text in text input
          'default', // keyboard type
        );
      } else if (index == 2) {
        PlaylistsDB.delete(playlistId);
      }
    });
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
