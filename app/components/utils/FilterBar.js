import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

function FilterBar({ updateFilter }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={updateFilter}
        enablesReturnKeyAutomatically={true}
        placeholder='Filter'
        placeholderTextColor={'rgb(150, 150, 150)'}
        clearButtonMode={'while-editing'}
        keyboardAppearance={'dark'}
      />
    </View>
  );
}

// These styles are very similar to the navbar SearchBar.
const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: 'rgb(50, 50, 50)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 28,
    color: 'white',
    backgroundColor: 'rgb(70, 70, 70)',
    marginTop: 6,
    margin: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
  },
});

FilterBar.propTypes = {
  updateFilter: PropTypes.func.isRequired,
};

export default FilterBar;
