import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { SearchBar } from 'react-native-elements';

class Search extends Component {
  _renderItem({ item }) {
    return (
      <Text>{item.title}</Text>
    );
  }

  render() {
    return (
      <View>
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

Search.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
};

export default Search;
