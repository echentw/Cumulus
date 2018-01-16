import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';

import Thumbnail from './Thumbnail';

function ListItem({ item, onPress, onPressEllipsis, isPlaying, isDownloading }) {
  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        onPress={onPress}
      >
        <Thumbnail size={40} url={item.thumbnail.url} isLoading={isDownloading}/>
        <Text
          style={ isPlaying ? styles.itemTextPlaying : styles.itemText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.itemEllipsis}
        onPress={onPressEllipsis}
      >
        <Icon size={16} name="dots-three-vertical"/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemEllipsis: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
});

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  onPressEllipsis: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isDownloading: PropTypes.bool,
};

export default ListItem;
