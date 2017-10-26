import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

class Playlists extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>You want to view your playlists hmm</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Playlists;
