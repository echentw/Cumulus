import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

const Login = (props) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.header}>
        Welcome Stranger!
      </Text>
      <View style={styles.avatar}>
        <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
      </View>
      <Text style={styles.text}>
        Please log in to continue {'\n'}
        to the awesomness
      </Text>
    </View>
    {/* Login buttons */}
    <View style={styles.buttons}>
      <Icon.Button
        name="google"
        backgroundColor="#DD4B39"
        onPress={props.loginWithGoogle}
        {...iconStyles}
      >
        Login with Google
      </Icon.Button>
    </View>
  </View>
);

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});

Login.proptypes = {
  loginWithGoogle: PropTypes.func.isRequired,
};

export default Login;
