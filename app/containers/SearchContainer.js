import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Search from '../components/Search';

import Sound from 'react-native-sound';
Sound.setCategory('Playback');

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
  }

  _onSubmitEditing() {
    const query = this.state.query;
    const maxResults = 10;

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

  _onPressPlay(videoId) {
    fetch('http://localhost:3000/play', {
      // TODO: authenticate this post request
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        videoId: videoId,
      }),
    })
    .then((response) => {
      const url = 'http://localhost:3000/downloads/' + videoId + '.mp3';
      const sound = new Sound(url, null, (error) => {
        if (error) {
          console.log('failed to load sound', error);
          return;
        }
        sound.setNumberOfLoops(-1);
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }

  _onPressMoreInfo(videoId) {
    console.log('you pressed the ellipsis for more info for video ' + videoId);
  }

  render() {
    const { searchResults } = this.state;
    return (
      <Search
        onChangeText={this._onChangeText}
        onSubmitEditing={this._onSubmitEditing}
        searchResults={searchResults}
        onPressPlay={this._onPressPlay}
        onPressMoreInfo={this._onPressMoreInfo}
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
