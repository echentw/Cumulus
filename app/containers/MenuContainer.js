import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';

import Menu from '../components/Menu';

class MenuContainer extends Component {
  constructor(props) {
    super(props);

    this._onPressMenuItem = this._onPressMenuItem.bind(this);
  }

  _onPressMenuItem(selection) {
    console.log('you pressed ' + selection);
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
