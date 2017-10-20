import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import { View, TextInput, Text, FlatList } from 'react-native';

import { SearchBar } from 'react-native-elements';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      searchResults: [],
    };

    this._onChangeText = this._onChangeText.bind(this);
    this._onSubmitEditing = this._onSubmitEditing.bind(this);
  }

  _onChangeText(text) {
    this.setState({query: text});
    console.log(text);
  }

  _onSubmitEditing() {
    const query = this.state.query;
    const maxResults = 5;

    const url = [
      'https://content.googleapis.com/youtube/v3/search?maxResults=' + maxResults,
      'part=snippet',
      'q=' + query,
      'type=video'
    ].join('&');

    fetch(url, {
      method: 'GET',
      referrerPolicy: 'no-referrer-when-downgrade',
      headers: {
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.8',
        'authorization': 'Bearer ' + this.props.user.token,
      },
    })
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
      this.setState({ searchResults: results });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _renderItem({ item }) {
    return (
      <Text>{item.title}</Text>
    );
  }

  render() {
    return (
      <View>
        <SearchBar
          onChangeText={this._onChangeText}
          onSubmitEditing={this._onSubmitEditing}
          enablesReturnKeyAutomatically={true}
          placeholder='Search'
        />
        <FlatList
          data={this.state.searchResults}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
