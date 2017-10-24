import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import { View } from 'react-native';
import SideMenu from 'react-native-side-menu';

import PlayerContainer from './PlayerContainer';
import SearchContainer from './SearchContainer';
import MenuContainer from './MenuContainer';

class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menu = <MenuContainer/>;
    return (
      <SideMenu menu={menu}>
        <View style={{flex: 1, backgroundColor: 'lightblue'}}>
          <SearchContainer/>
        </View>
      </SideMenu>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
