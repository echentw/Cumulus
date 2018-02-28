import React, { Component } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import { thumbnailPath } from '../../lib/songManagement';
import ListItem from './ListItem';

class FilterableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topScrollAnim: new Animated.Value(-50),
      previousY: 0,
      isDragging: false,
    };
  }

  _renderItem = ({ item }) => {
    item.thumbnail = {
      url: thumbnailPath(item.videoId),
    };
    return (
      <ListItem
        item={item}
        onPress={() => this.props.onPressPlay(item.videoId, item.title, item.thumbnail)}
        onPressEllipsis={() => this.props.onPressMoreInfo(item.videoId, item.title, item.thumbnail)}
        isPlaying={this.props.videoIdPlaying == item.videoId}
      />
    );
  }

  onScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (this.state.isDragging) {
      if (currentY < 0 && this.state.previousY >= 0) {
        // Show the filter bar.
        Animated.timing(this.state.topScrollAnim, {
          toValue: 0,
          duration: 100,
        }).start();
      } else if (currentY > 0 && this.state.previousY <= 0) {
        // Hide the filter bar.
        Animated.timing(this.state.topScrollAnim, {
          toValue: -50,
          duration: 100,
        }).start();
        Keyboard.dismiss();
      }
    }
    this.setState({ previousY: currentY });
  }

  onScrollBeginDrag = (event) => {
    this.setState({ isDragging: true });
  }

  onScrollEndDrag = (event) => {
    this.setState({ isDragging: false });
  }

  render() {
    const flatListPadding = this.state.topScrollAnim.interpolate({
      inputRange: [-50, 0],
      outputRange: [0, 50],
      extrapolateLeft: 'clamp',
    });

    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <Animated.View style={{ paddingTop: flatListPadding, position: 'relative' }}>
          <FlatList
            data={this.props.songs}
            renderItem={this._renderItem}
            extraData={this.props.videoIdPlaying}
            onScroll={this.onScroll}
            onScrollBeginDrag={this.onScrollBeginDrag}
            onScrollEndDrag={this.onScrollEndDrag}
          />
        </Animated.View>
        <Animated.View style={[
          styles.textInputContainer,
          {
            transform: [
              { translateY: this.state.topScrollAnim }
            ]
          }
        ]}>
          <TextInput
            style={styles.textInput}
            onChangeText={this.props.updateFilter}
            enablesReturnKeyAutomatically={true}
            placeholder='Filter'
            placeholderTextColor={'rgb(150, 150, 150)'}
            clearButtonMode={'while-editing'}
            keyboardAppearance={'dark'}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInputContainer: {
    position: 'absolute',
    height: 50,
    width: '100%',
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

FilterableList.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterableList;
