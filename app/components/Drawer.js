import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

class Drawer extends Component {
  _renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={'lightgrey'}
        onPress={() => this.props.onPressItem(item.key)}
      >
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.key}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Search'},
            {key: 'Saved Songs'},
            {key: 'Playlists'},
          ]}
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
    justifyContent: 'center',
    height: 80,
    paddingLeft: 10,
  },
  itemText: {
    fontSize: 22,
  },
});

Drawer.propTypes = {
  onPressItem: PropTypes.func.isRequired,
};

export default Drawer;
