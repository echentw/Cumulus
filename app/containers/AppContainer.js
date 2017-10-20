import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ActionCreators } from '../actions';
import LoginContainer from './LoginContainer';
import MainContainer from './MainContainer';

class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    if (user) {
      return (
        <MainContainer/>
      );
    } else {
      return (
        <LoginContainer/>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
