import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import { thumbnailPath } from '../../lib/songManagement';
import ListItem from '../utils/ListItem';

class PlaylistView extends Component {
  _renderItem = ({ item }) => {
    item.thumbnail = {
      url: thumbnailPath(item.videoId),
    };
    return (
      <ListItem
        item={item}
        onPress={() => this.props.onPressPlay(item.videoId, item.title, item.thumbnail)}
        onPressEllipsis={() => this.props.onPressMoreInfo(item.videoId, item.title, item.thumbnail)}
        isPlaying={this.props.videoIdPlaying == item.videoId}
      />
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
      <FlatList
        data={this.props.songs}
        renderItem={this._renderItem}
        extraData={this.props.videoIdPlaying}
      />
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
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
};

export default PlaylistView;
