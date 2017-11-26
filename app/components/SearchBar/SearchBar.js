import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import { View } from 'react-native';

import youtubeSearch from '../../lib/youtubeSearch';

import SearchBarView from './SearchBarView';

class SearchBar extends Component {
  _onChangeText = (text) => {
    this.props.updateSearchQuery(text);
  }

  _onSubmitEditing = () => {
    youtubeSearch(this.props.searchQuery)
      .then((response) => {
        const blob = JSON.parse(response._bodyText);
        const results = blob.items.map((result) => ({
          key: result.id.videoId,
          videoId: result.id.videoId,
          title: result.snippet.title,
          thumbnail: {
            url: result.snippet.thumbnails.high.url,
            height: result.snippet.thumbnails.high.height,
            width: result.snippet.thumbnails.high.width,
          },
        }));
        this.props.updateSearchResults(results);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <SearchBarView
        onChangeText={this._onChangeText}
        onSubmitEditing={this._onSubmitEditing}
        defaultSearchQuery={this.props.searchQuery}
        onFocus={this.props.searchBarFocus}
        onBlur={this.props.searchBarBlur}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    searchQuery: state.searchQuery,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
