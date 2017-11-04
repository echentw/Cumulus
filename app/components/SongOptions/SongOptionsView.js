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
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Download song'},
            {key: 'Add to playlist'},
            {key: 'Cancel'},
          ]}
          scrollEnabled={false}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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

SongOptionsView.propTypes = {
  songInfo: PropTypes.object.isRequired,
  songInfoBlur: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default SongOptionsView;
