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

    this._renderItem = this._renderItem.bind(this);
  }

  _renderItem({ item }) {
    return (
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'rgb(220, 220, 220)'}
        onPress={() => this.props.onPressPlay(item.videoId)}
      >
        <View style={styles.item}>
          <Image style={styles.itemImage} source={{uri: item.thumbnail.url}}/>
          <Text style={styles.itemText} numberOfLines={1} ellipsizeMode={'tail'}>
            {item.title}
          </Text>
          <TouchableHighlight
            activeOpacity={0.5}
            style={{marginLeft: 6}}
            underlayColor={'white'}
            onPress={() => this.props.onPressMoreInfo(item.videoId)}
            onShowUnderlay={this._onPressIn}
            onHideUnderlay={this._onPressOut}
          >
            <Icon size={16} name="dots-three-vertical"/>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
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
});

Search.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  onPressPlay: PropTypes.func.isRequired,
  onPressMoreInfo: PropTypes.func.isRequired,
};

export default Search;
