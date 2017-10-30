import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import PropTypes from 'prop-types';

class CumulusHeader extends Component {
  render() {
    return (
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: this.props.title, style: styles.centerComponent }}
        outerContainerStyles={{ backgroundColor: 'lightblue', position: 'relative' }}
      />
    );
  }
}

const styles = StyleSheet.create({
  centerComponent: {
    fontSize: 18,
    color: '#fff',
  },
});

CumulusHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CumulusHeader;
