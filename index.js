import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import AppContainer from './app/containers/AppContainer';
import reducer from './app/reducers';

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
  },
});

const App = () => (
  <Provider store={store}>
    <AppContainer/>
  </Provider>
);

AppRegistry.registerComponent('Cumulus', () => App);
