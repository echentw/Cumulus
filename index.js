import React, { Component } from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducer from './app/reducers';

import navigation from './app/navigation/navigation';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
    ),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({
  user: null,
  player: null,
  playingStatus: false,
  currentSongInfo: {
    videoId: null,
    title: null,
    thumbnail: null,
  },
  searchQuery: '',
  searchResults: [],
  searchBarFocused: false,
});

navigation.registerScreens(store, Provider);

AsyncStorage.getItem('refreshToken')
  .then((token) => {
    if (token) {
      navigation.startApp();
    } else {
      navigation.startLogin();
    }
  });
