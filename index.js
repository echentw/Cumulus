import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import AppContainer from './app/containers/AppContainer';
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
  },
});

registerScreens(store, Provider);

Navigation.startSingleScreenApp({
  screen: {
    screen: 'Cumulus.SearchContainer',
    title: 'Search',
    navigatorStyle: {
      navBarHidden: true,
    }
  },
  drawer: {
    left: {
      screen: 'Cumulus.SideMenuContainer',
      // passpProps: {},
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

// Navigation.startTabBasedApp({
//   tabs: [{
//     label: 'One', // tab label as appears under the icon in iOS (optional)
//     screen: 'Cumulus.SearchContainer', // unique ID registered with Navigation.registerScreen
//     title: 'Search', // title of the screen as appears in the nav bar (optional)
//     navigatorStyle: {
//       navBarHidden: true,
//     },
//   }, {
//     label: 'Two',
//     screen: 'Cumulus.LoginContainer',
//     title: 'Login',
//   }],
//   drawer: {
//     left: {
//       screen: 'Cumulus.SideMenuContainer',
//       passProps: {}
//     },
//     style: {
//       drawerShadow: false,
//       contentOverlayColor: 'rgba(0,0,0,0.1)',
//       leftDrawerWidth: 80,
//     },
//     type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
//     animationType: 'parallax', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
//                                         // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
//   },
//   passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
//   animationType: 'none' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
// });

// const App = () => (
//   <Provider store={store}>
//     <AppContainer/>
//   </Provider>
// );

// AppRegistry.registerComponent('Cumulus', () => App);
