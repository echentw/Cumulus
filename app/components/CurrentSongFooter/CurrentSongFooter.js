import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

class CurrentSongFooter extends Component {
  render() {
    const title = this.props.currentSongInfo.title ? this.props.currentSongInfo.title : 'No song playing';

    return (
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'rgb(220, 220, 220)'}
        onPress={() => console.log('you wanna see more about the current song hmmm')}
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 12 }}>Current Song</Text>
          <Text
            style={{ fontSize: 18 }}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingTop: 2,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
  },
});

function mapStateToProps(state) {
  return {
    player: state.player,
    playingStatus: state.playingStatus,
    currentSongInfo: state.currentSongInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSongFooter);
