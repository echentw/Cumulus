import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

class SongOptionsView extends Component {
  _renderItem = ({ item }) => {
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
    return (
      <View style={{ flex: 1 }}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  itemText: {
    fontSize: 18,
  },
});

SongOptionsView.propTypes = {
  songInfo: PropTypes.object.isRequired,
  songInfoBlur: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default SongOptionsView;
