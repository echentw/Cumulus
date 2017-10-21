import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressedIn: false,
    };

    this._renderItem = this._renderItem.bind(this);
    this._onPressIn = this._onPressIn.bind(this);
    this._onPressOut = this._onPressOut.bind(this);
  }

  _onPressIn() {
    this.setState({pressedIn: true});
  }

  _onPressOut() {
    this.setState({pressedIn: false});
  }

  _renderItem({ item }) {
    return (
      <View style={styles.item}>
        <Image style={styles.itemImage} source={{uri: item.thumbnail.url}}/>
        <Text style={styles.itemText} numberOfLines={1} ellipsizeMode={'tail'}>
          {item.title}
        </Text>
        <TouchableHighlight
          activeOpacity={1}
          style={{marginLeft: 6}}
          underlayColor={'white'}
          onPress={this.props.onPressMoreInfo}
          onShowUnderlay={this._onPressIn}
          onHideUnderlay={this._onPressOut}
        >
          <Icon
            style={this.state.pressedIn ? styles.ellipsisPressed : styles.ellipsis}
            size={16}
            name="dots-three-vertical"
          />
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          enablesReturnKeyAutomatically={true}
          placeholder='Search'
        />
        <FlatList
          data={this.props.searchResults}
          renderItem={this._renderItem}
          extraData={this.state}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingLeft: 4,
    paddingRight: 10,
  },
  itemImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  ellipsis: {
    color: 'black',
  },
  ellipsisPressed: {
    color: 'grey',
  },
});

Search.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
};

export default Search;
