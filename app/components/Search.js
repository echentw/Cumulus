import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import { SearchBar } from 'react-native-elements';

class Search extends Component {
  _renderItem({ item }) {
    return (
      <View style={styles.item}>
        <Image style={styles.itemImage} source={{uri: item.thumbnail.url}}/>
        <Text style={styles.itemText} numberOfLines={1} ellipsizeMode={'tail'}>
          {item.title}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          enablesReturnKeyAutomatically={true}
          placeholder='Search'
        />
        <FlatList
          data={this.props.searchResults}
          renderItem={this._renderItem}
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
    paddingLeft: 4,
    paddingRight: 4,
  },
  itemImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  itemText: {
    marginLeft: 6,
    fontSize: 18,
  },
});

Search.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
};

export default Search;
