import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import { Text } from 'react-native';

import PlayerContainer from './PlayerContainer';
import SearchContainer from './SearchContainer';

class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SearchContainer/>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
