import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';

class PlaylistsView extends Component {
  _renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          onPress={() => this.props.onPress(item.playlistId, item.title)}
        >
          <Text style={styles.itemText} numberOfLines={1} ellipsizeMode={'tail'}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemThreeDots}
          onPress={() => this.props.onPressOptions(item.playlistId, item.title)}
        >
          <Icon size={16} name="dots-three-vertical"/>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(230, 230, 230)' }}>
        <FlatList
          data={this.props.playlists}
          renderItem={this._renderItem}
        />
        <Button
          title={'+ New Playlist'}
          onPress={this.props.onPressNewPlaylist}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 8,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  itemThreeDots: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(230, 230, 230)',
  }
});

PlaylistsView.propTypes = {
  playlists: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  onPressOptions: PropTypes.func.isRequired,
  onPressNewPlaylist: PropTypes.func.isRequired,
};

export default PlaylistsView;
