import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Entypo';

import ListItem from '../utils/ListItem';

class SearchView extends Component {
  _renderItem = ({ item }) => {
    return (
      <ListItem
        item={item}
        onPress={() => this.props.onPressPlay(item.videoId, item.title, item.thumbnail)}
        onPressEllipsis={() => this.props.onPressMoreInfo(item.videoId, item.title, item.thumbnail)}
        isPlaying={this.props.videoIdPlaying == item.videoId}
      />
    );
  }

  render() {
    return (
      <FlatList
        data={this.props.searchResults}
        renderItem={this._renderItem}
        extraData={{...this.state, videoIdPlaying: this.props.videoIdPlaying}}
      />
    );
  }
}

SearchView.propTypes = {
  searchResults: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
};

export default SearchView;
