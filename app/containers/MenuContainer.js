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
  }

  _onPressMenuItem(selection) {
    if (selection == 'Your Songs') {
      console.log('you wanna view your songs :)');
      RNFS.readdir(RNFS.DocumentDirectoryPath + '/songs').then((files) => {
        console.log(files);
      });
      const songs = getSongs().map((song) => song.title);
      console.log(songs);
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
