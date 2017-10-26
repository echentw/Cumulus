import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Menu from '../components/Menu';

import RNFS from 'react-native-fs';
import { getSongs } from '../db/realm';

class MenuContainer extends Component {
  constructor(props) {
    super(props);

    this._onPressMenuItem = this._onPressMenuItem.bind(this);

    console.log('menu navigator', this.props.navigator);
  }

  _onPressMenuItem(selection) {
    if (selection == 'Your Songs') {
      console.log('you wanna view your songs :)');
      RNFS.readdir(RNFS.DocumentDirectoryPath + '/songs').then((files) => {
        console.log(files);
      });
      const songs = getSongs().map((song) => song.title);
      console.log(songs);
    } else if (selection == 'Search') {
      // this.props.navigator.
      console.log('you pressed search!');

      // console.log(this.props.navigator.resetTo);

// this.props.navigator.push({
//   screen: 'Cumulus.LoginContainer', // unique ID registered with Navigation.registerScreen
//   title: undefined, // navigation bar title of the pushed screen (optional)
//   // titleImage: require('../../img/my_image.png'), // iOS only. navigation bar title image instead of the title text of the pushed screen (optional)
//   passProps: {}, // Object that will be passed as props to the pushed screen (optional)
//   animated: true, // does the push have transition animation or does it happen immediately (optional)
//   animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
//   backButtonTitle: undefined, // override the back button title (optional)
//   backButtonHidden: false, // hide the back button altogether (optional)
//   navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
//   navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
// });

// this.props.navigator.showModal({
//   screen: "Cumulus.LoginContainer", // unique ID registered with Navigation.registerScreen
//   title: "Modal", // title of the screen as appears in the nav bar (optional)
//   passProps: {}, // simple serializable object that will pass as props to the modal (optional)
//   navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
//   animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
// });

this.props.navigator.toggleDrawer({
  side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
  animated: true, // does the toggle have transition animation or does it happen immediately (optional)
  to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
});

      // this.props.navigator.resetTo({
      //   screen: 'Cumulus.LoginContainer', // unique ID registered with Navigation.registerScreen
      //   passProps: {},
      //   animated: true, // does the resetTo have transition animation or does it happen immediately (optional)
      //   animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
      //   navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
      //   navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
      // });
    } else {
      console.log('you pressed ' + selection);
    }
  }

  render() {
    return (
      <Menu onPressMenuItem={this._onPressMenuItem}/>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer);
