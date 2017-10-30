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
          <TouchableHighlight
            activeOpacity={0.5}
            style={{marginLeft: 6}}
            underlayColor={'white'}
            onPress={() => console.log('you are pressing me')}
            onShowUnderlay={this._onPressIn}
            onHideUnderlay={this._onPressOut}
          >
            <Icon size={16} name="dots-three-vertical"/>
          </TouchableHighlight>
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
    paddingRight: 8,
  },
  itemImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  itemTextPlaying: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
});

SavedSongsView.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
};

export default SavedSongsView;