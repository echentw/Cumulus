import React, { Component } from 'react';
import { Linking, Platform, AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import SafariView from 'react-native-safari-view';
import QueryString from 'query-string';
import parseUrl from 'url-parse';

import { getOAuthEntrypoint } from '../../lib/serverRequest';
import navigation from '../../navigation/navigation';

import LoginView from './LoginView';

class Login extends Component {
  // Set up Linking
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  };

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = async ({ url }) => {
    const queryString = parseUrl(url).query;
    const { accessToken, refreshToken} = QueryString.parse(queryString);
    await AsyncStorage.multiSet([['accessToken', accessToken], ['refreshToken', refreshToken]]);
    navigation.startApp();
  };

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL(getOAuthEntrypoint());

  // Open URL in a browser
  openURL = (url) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  render() {
    return (
      <LoginView loginWithGoogle={this.loginWithGoogle}/>
    );
  }
}
function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
