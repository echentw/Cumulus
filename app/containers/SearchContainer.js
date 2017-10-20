import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import { View, TextInput } from 'react-native';

import { SearchBar } from 'react-native-elements';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};

    this._onChangeText = this._onChangeText.bind(this);
    this._onSubmitEditing = this._onSubmitEditing.bind(this);
  }

  _onChangeText(text) {
    this.setState({text: text});
    console.log(text);
  }

  _onSubmitEditing() {
    const query = this.state.text;
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
      console.log(JSON.parse(response._bodyText));
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <SearchBar
        onChangeText={this._onChangeText}
        onSubmitEditing={this._onSubmitEditing}
        enablesReturnKeyAutomatically={true}
        placeholder='Search'
      />
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
