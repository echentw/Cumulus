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

class PlaylistView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>You wanna see this playlist hmmm</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(230, 230, 230)',
  }
});

PlaylistView.propTypes = {
};

export default PlaylistView;
