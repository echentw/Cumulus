import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducer from './app/reducers';

import { Navigation } from 'react-native-navigation';

import { registerScreens } from './app/screens';

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
  player: {
    videoId: null,
    sound: null,
  },
  playingStatus: true,
  songInfo: {
    videoId: null,
    title: null,
    thumbnail: null,
  },
  searchQuery: '',
  searchResults: [],
});

registerScreens(store, Provider);

Navigation.startSingleScreenApp({
  screen: {
    screen: 'Cumulus.Login',
    title: 'Search',
    navigatorStyle: {
      navBarHidden: true,
    }
  },
  drawer: {
    left: {
      screen: 'Cumulus.Drawer',
    },
    style: {
      drawerShadow: false,
      contentOverlayColor: 'rgba(0,0,0,0.1)',
      leftDrawerWidth: 80, // percent
    },
    animationType: 'parallax', // TODO: can play around with different options here :D
  },
  passProps: {},
  animationType: 'none',
});
