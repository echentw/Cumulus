import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Drawer from '../components/Drawer';

import RNFS from 'react-native-fs';
import { getSongs } from '../db/realm';

class DrawerContainer extends Component {
  _onPressItem = (selection) => {
    this.props.navigator.toggleDrawer({
      side: 'left',
      animated: true,
      to: 'closed',
    });

    let link;
    if (selection == 'Saved Songs') {
      link = 'Cumulus.SavedSongs';
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
