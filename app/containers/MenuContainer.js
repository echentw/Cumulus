import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Menu from '../components/Menu';

import RNFS from 'react-native-fs';
import { getSongs } from '../db/realm';

class MenuContainer extends Component {
  constructor(props) {
    super(props);

    this._onPressMenuItem = this._onPressMenuItem.bind(this);

    console.log('menu navigator', this.props.navigator);
  }

  _onPressMenuItem(selection) {
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
        link: 'Cumulus.SearchContainer',
      });
    } else {
      console.log('you pressed ' + selection);
    }
  }

  render() {
    return (
      <Menu onPressMenuItem={this._onPressMenuItem}/>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
