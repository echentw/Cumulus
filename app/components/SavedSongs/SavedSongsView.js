import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Entypo';

class SavedSongsView extends Component {
  _renderItem = ({ item }) => {
    const thumbnail = {
      url: RNFS.DocumentDirectoryPath + '/thumbnails/thumbnail_' + item.videoId + '.jpg',
      // TODO: add height and width to here
    };

    return (
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'rgb(220, 220, 220)'}
        onPress={() => this.props.onPressPlay(item.videoId, item.title, item.thumbnail)}
      >
        <View style={styles.item}>
          <Image style={styles.itemImage} source={{uri: thumbnail.url}}/>
          <Text
            style={this.props.videoIdPlaying == item.videoId ? styles.itemTextPlaying : styles.itemText}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {item.title}
          </Text>
          <View style={{ flexDirection: 'column' }}>
            <TouchableOpacity
              style={styles.itemThreeDots}
              onPress={() => console.log('you are pressing me')}
            >
              <Icon size={16} name="dots-three-vertical"/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingLeft: 8,
  },
  itemImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  itemTextPlaying: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  itemThreeDots: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: 50,
  },
});

SavedSongsView.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
};

export default SavedSongsView;
