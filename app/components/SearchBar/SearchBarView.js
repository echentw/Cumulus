import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';

class SearchBarView extends Component {
  render() {
    return (
      <TextInput
        style={styles.searchBar}
        onChangeText={this.props.onChangeText}
        onSubmitEditing={this.props.onSubmitEditing}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        enablesReturnKeyAutomatically={true}
        placeholder='Search'
        placeholderTextColor={'rgb(150, 150, 150)'}
        defaultValue={this.props.defaultSearchQuery}
        returnKeyType={'search'}
        clearButtonMode={'while-editing'}
        keyboardAppearance={'dark'}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    height: 28,
    color: 'white',
    backgroundColor: 'rgb(70, 70, 70)',
    marginTop: 6,
    margin: 6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
  },
});

SearchBarView.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  defaultSearchQuery: PropTypes.string.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default SearchBarView;
