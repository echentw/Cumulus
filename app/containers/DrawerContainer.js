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
    if (selection == 'Your Songs') {
      console.log('you wanna view your songs :)');
      RNFS.readdir(RNFS.DocumentDirectoryPath + '/songs').then((files) => {
        console.log(files);
      });
      const songs = getSongs().map((song) => song.title);
      console.log(songs);
    } else if (selection == 'Search') {
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
        to: 'closed',
      });
      this.props.navigator.handleDeepLink({
        link: 'Cumulus.Search',
      });
    } else {
      console.log('you pressed ' + selection);
    }
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
