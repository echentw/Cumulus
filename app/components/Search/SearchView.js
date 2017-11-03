import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

class SearchView extends Component {
  _renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'rgb(220, 220, 220)'}
        onPress={() => this.props.onPressPlay(item.videoId, item.title, item.thumbnail)}
      >
        <View style={styles.item}>
          <Image style={styles.itemImage} source={{uri: item.thumbnail.url}}/>
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
              onPress={() => this.props.onPressMoreInfo(item.videoId, item.title, item.thumbnail)}
            >
              <Icon size={16} name='dots-three-vertical'/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          clearIcon
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          enablesReturnKeyAutomatically={true}
          placeholder='Search'
          defaultValue={this.props.defaultSearchQuery}
        />
        <FlatList
          data={this.props.searchResults}
          renderItem={this._renderItem}
          extraData={{...this.state, videoIdPlaying: this.props.videoIdPlaying}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
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
    fontSize: 18,
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

SearchView.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
  defaultSearchQuery: PropTypes.string.isRequired,
};

export default SearchView;
