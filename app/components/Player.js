import React from 'react';
import { StyleSheet, View, Image, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

const Player = (props) => {
  const { user } = props;
  return (
    <View style={styles.container}>
      <Text>Welcome {user.name}!</Text>
      <View style={styles.avatar}>
        <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
      </View>

      <TouchableHighlight onPress={props.onPressPlayPauseButton} underlayColor="white">
        <Text>Play/Pause</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
});

Player.propTypes = {
  onPressPlayPauseButton: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Player;
