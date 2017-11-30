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

class PlaylistsView extends Component {
  _renderItem = ({ item }) => {
    return (
      <View>
        <Text>title: {item.title}</Text>
        <Text>id: {item.playlistId}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.playlists}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgb(230, 230, 230)',
  }
});

PlaylistsView.propTypes = {
  playlists: PropTypes.any,
};

export default PlaylistsView;
