import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import SafariView from 'react-native-safari-view';

import { getOAuthEntrypoint } from '../../lib/serverRequest';

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

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, userString] = url.match(/user=([^#]+)/);
    this.props.setUser(JSON.parse(decodeURI(userString)));
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
    this.props.navigator.resetTo({
      screen: 'Cumulus.Search',
      animated: true,
      animationType: 'fade',
      navigatorStyle: {
        navBarHidden: true,
      },
    });
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
