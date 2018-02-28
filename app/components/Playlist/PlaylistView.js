import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import FilterableList from '../utils/FilterableList';

class PlaylistView extends Component {
  render() {
    if (this.props.songs.length == 0) {
      return (
        <View style={styles.container}>
          <Text>This playlist is empty!</Text>
        </View>
      );
    }

    return (
      <FilterableList
        songs={this.props.songs}
        onPressPlay={this.props.onPressPlay}
        onPressMoreInfo={this.props.onPressMoreInfo}
        videoIdPlaying={this.props.videoIdPlaying}
        updateFilter={this.props.updateFilter}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(230, 230, 230)',
  }
});

PlaylistView.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
  updateFilter: PropTypes.func.isRequired,
};

export default PlaylistView;
