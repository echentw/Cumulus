import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { thumbnailPath } from '../../lib/songManagement';
import ListItem from '../utils/ListItem';

class SavedSongsView extends Component {
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

  render() {
    return (
      <FlatList
        data={this.props.songs}
        renderItem={this._renderItem}
        extraData={this.props.videoIdPlaying}
      />
    );
  }
}

SavedSongsView.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
};

export default SavedSongsView;
