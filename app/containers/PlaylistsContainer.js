import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Playlists from '../components/Playlists';

class PlaylistsContainer extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'DeepLink') {
      this.props.navigator.resetTo({
        screen: event.link,
        animated: true,
        animationType: 'fade',
        navigatorStyle: {
          navBarHidden: true,
        },
      });
    }
  }

  render() {
    return (
      <Playlists/>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsContainer);
