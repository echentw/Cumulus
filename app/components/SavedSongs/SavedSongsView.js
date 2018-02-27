import React, { Component } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';

import { thumbnailPath } from '../../lib/songManagement';
import ListItem from '../utils/ListItem';
import FilterBar from '../utils/FilterBar';

class SavedSongsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topScrollAnim: new Animated.Value(-50),
      previousY: 0,
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
    this.setState({ previousY: currentY });
  }

  render() {
    return (
      <Animated.View style={{
        flex: 1,
        transform: [
          { translateY: this.state.topScrollAnim },
        ],
      }}>
        <FilterBar updateFilter={this.props.updateFilter}/>
        <FlatList
          data={this.props.songs}
          renderItem={this._renderItem}
          extraData={this.props.videoIdPlaying}
          onScroll={this.onScroll}
        />
      </Animated.View>
    );
  }
}

SavedSongsView.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
  updateFilter: PropTypes.func.isRequired,
};

export default SavedSongsView;
