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
  _renderItem = ({ item }) => {
    return (
      <Text>item.title</Text>
    );
  }

  render() {
    if (this.props.songs.length == 0) {
      return (
        <View style={styles.container}>
          <Text>This playlist is empty!</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.songs}
          renderItem={this._renderItem}
        />
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
  songs: PropTypes.array.isRequired,
};

export default PlaylistView;
