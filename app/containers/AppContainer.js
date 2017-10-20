import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ActionCreators } from '../actions';
import LoginContainer from './LoginContainer';
import MainContainer from './MainContainer';

class AppContainer extends Component {
  constructor(props) {
    super(props);

    fetch('https://content.googleapis.com/youtube/v3/search?maxResults=5&part=snippet&q=hello&type=video', {
      method: 'GET',
      referrerPolicy: 'no-referrer-when-downgrade',
      headers: {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.8',
        'authorization': 'Bearer <TOKEN>',
      },
    })
    .then((response) => {
      console.log(JSON.parse(response._bodyText));
    })
    .catch((error) => {
      console.error(error);
    });
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
