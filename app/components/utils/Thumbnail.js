import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import CircleSnail from 'react-native-progress/CircleSnail';

export default class Thumbnail extends Component {
  render() {
    const { size } = this.props;
    const radius = size / 2;

    const styles = {
      container: {
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        position: 'absolute',
        height: 2 * radius,
        width: 2 * radius,
        borderRadius: radius,
      },
    };

    if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: this.props.url }}/>
          <CircleSnail
            size={size + 10}
            indeterminate={true}
            duration={1200}
            thickness={2}
            animating={true}
            hidesWhenStopped={true}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: this.props.url }}/>
        </View>
      );
    }
  }
}

Thumbnail.propTypes = {
  size: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};
