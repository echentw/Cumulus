import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

const App = (props) => (
  <View style={styles.container}>
    <TouchableHighlight onPress={props.onPressPlayPauseButton} underlayColor="white">
      <Text>Play/Pause</Text>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'lightblue',
  }
});

App.propTypes = {
  onPressPlayPauseButton: PropTypes.func.isRequired,
};

export default App;
