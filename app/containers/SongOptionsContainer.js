import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import SongOptions from '../components/SongOptions';

class SongOptionsContainer extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
  }

  _onPress(value) {
    if (value == 'Download song') {
      console.log('you want to download song with id ' + this.props.songInfo);
    } else {
      console.log('you pressed ' + value);
    }
  }

  render() {
    return (
      <SongOptions
        songInfo={this.props.songInfo}
        songInfoBlur={this.props.songInfoBlur}
        onPress={this._onPress}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    songInfo: state.songInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SongOptionsContainer);
