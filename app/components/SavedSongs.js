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

class SavedSongs extends Component {
  _renderItem({ item }) {
    return (
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'rgb(220, 220, 220)'}
        onPress={() => console.log('you wanna play this song')}
      >
        <View style={styles.item}>
          <Image style={styles.itemImage} source={{uri: RNFS.DocumentDirectoryPath + '/thumbnails/thumbnail_' + item.videoId + '.jpg'}}/>
          <Text
            style={styles.itemText}
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
      // <View style={styles.container}>
      //   <Text>You want to view your saved songs hmm</Text>
      // </View>
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
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // }
  container: {
    flex: 1,
    paddingTop: 22,
  },
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

SavedSongs.propTypes = {
  songs: PropTypes.array.isRequired,
};

export default SavedSongs;
