import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
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
    const { height, width, url } = this.props.songInfo.thumbnail;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>{this.props.songInfo.title}</Text>
        <Image
          style={{ height: height / 4, width: width / 4, borderRadius: 20, marginBottom: 20 }}
          source={{ uri: url }}
        />
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
    width: 500, // Maybe at some point, figure out how to properly do this.
    alignItems: 'center',
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
