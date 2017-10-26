import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Drawer from '../components/Drawer';

import RNFS from 'react-native-fs';
import { getSongs } from '../db/realm';

class DrawerContainer extends Component {
  constructor(props) {
    super(props);

    this._onPressItem = this._onPressItem.bind(this);
  }

  _onPressItem(selection) {
    this.props.navigator.toggleDrawer({
      side: 'left',
      animated: true,
      to: 'closed',
    });

    let link;
    if (selection == 'Saved Songs') {
      link = 'Cumulus.SavedSongs';
      // console.log('you wanna view your songs :)');
      // RNFS.readdir(RNFS.DocumentDirectoryPath + '/songs').then((files) => {
      //   console.log(files);
      // });
      // const songs = getSongs().map((song) => song.title);
      // console.log(songs);
    } else if (selection == 'Search') {
      link = 'Cumulus.Search';
    } else if (selection == 'Playlists') {
      link = 'Cumulus.Playlists';
    } else {
      console.log('unhandled button!', selection);
    }
    this.props.navigator.handleDeepLink({ link: link });
  }

  render() {
    return (
      <Drawer onPressItem={this._onPressItem}/>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);
