import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';

class SearchBarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelButtonWidth: new Animated.Value(0),
      cancelButtonOpacity: new Animated.Value(0.0),
    };
  }

  _onFocus = () => {
    Animated.parallel([
      Animated.timing(this.state.cancelButtonWidth, {
        toValue: 66,
        duration: 250,
      }),
      Animated.sequence([
        Animated.timing(this.state.cancelButtonOpacity, {
          toValue: 0.0,
          duration: 200,
        }),
        Animated.timing(this.state.cancelButtonOpacity, {
          toValue: 1.0,
          duration: 100,
        }),
      ]),
    ]).start();
    this.props.onFocus();
  }

  _onBlur = () => {
    Animated.parallel([
      Animated.timing(this.state.cancelButtonWidth, {
        toValue: 0,
        duration: 250,
      }),
      Animated.timing(this.state.cancelButtonOpacity, {
        toValue: 0.0,
        duration: 50,
      }),
    ]).start();
    Keyboard.dismiss();
    this.props.onBlur();
  }

  CancelButton = () => {
    return (
      <Animated.View style={{
        width: this.state.cancelButtonWidth,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={this._onBlur}
        >
          <Animated.Text style={{
            color: 'rgb(150, 150, 150)',
            fontSize: 16,
            opacity: this.state.cancelButtonOpacity
          }}>
            Cancel
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TextInput
          style={styles.searchBar}
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          enablesReturnKeyAutomatically={true}
          placeholder='Search'
          placeholderTextColor={'rgb(150, 150, 150)'}
          defaultValue={this.props.defaultSearchQuery}
          returnKeyType={'search'}
          clearButtonMode={'while-editing'}
          keyboardAppearance={'dark'}
        />
        <this.CancelButton/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
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
