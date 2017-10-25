import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

class SongOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bounceValue: new Animated.Value(200),
    };

    this._toggle = this._toggle.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  _toggle() {
    const toValue = this.props.songInfo.videoId ? 0 : 200;
    Animated.spring(this.state.bounceValue, {
      toValue: toValue,
      velocity: 4,
      bounciness: 0,
    }).start();
  }

  _renderItem({ item }) {
    return (
      <TouchableHighlight
        underlayColor={'lightgrey'}
        onPress={() => this.props.onPress(item.key)}
      >
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.key}</Text>
        </View>
      </TouchableHighlight>
    );

    return <Text>{item.key}</Text>
  }

  render() {
    this._toggle();
    return (
      <Animated.View
        style={[
          styles.subView,
          {
            transform: [{
              translateY: this.state.bounceValue
            }]
          }
        ]}
      >
        <FlatList
          data={[{key: 'Download song'}, {key: 'Something else'}]}
          renderItem={this._renderItem}
        />
        <TouchableHighlight
          underlayColor={'lightgrey'}
          onPress={this.props.songInfoBlur}
        >
          <View style={styles.item}>
            <Text style={styles.itemText}>Cancel</Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  subView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    height: 200,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  itemText: {
    fontSize: 18,
  },
});

SongOptions.propTypes = {
  songInfo: PropTypes.object.isRequired,
  songInfoBlur: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default SongOptions;
