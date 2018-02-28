import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilterableList from '../utils/FilterableList';

class SavedSongsView extends Component {
  render() {
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

SavedSongsView.propTypes = {
  songs: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
  videoIdPlaying: PropTypes.string,
  updateFilter: PropTypes.func.isRequired,
};

export default SavedSongsView;
