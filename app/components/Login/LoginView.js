import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

const LoginButton = (props) => (
  <TouchableOpacity
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      width: 250,
      height: 50,
      borderWidth: 2,
      borderRadius: 6,
      borderColor: 'rgb(230, 230, 230)',
      backgroundColor: 'rgb(30, 30, 30)',
    }}
    onPress={props.onPress}
  >
    <Text style={{
      fontSize: 18,
      color: 'rgb(230, 230, 230)',
    }}>
      Login with Google
    </Text>
  </TouchableOpacity>
);

class LoginView extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(50, 50, 50)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>
            Cumulus
          </Text>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold' }}>
            Music
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoginButton onPress={this.props.loginWithGoogle}/>
        </View>
      </View>
    );
  }
}

LoginView.propTypes = {
  loginWithGoogle: PropTypes.func.isRequired,
};

export default LoginView;
