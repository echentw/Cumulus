import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';

function startLogin() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'Cumulus.Login',
      navigatorStyle: {
        navBarHidden: true,
      },
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
}

function startApp() {
  Navigation.startTabBasedApp({
    tabs: [
      {
        label: 'Search',
        screen: 'Cumulus.Search',
        // icon: require('../img/one.png'),
        // selectedIcon: require('../img/one_selected.png'),
        title: 'Search',
      },
      {
        label: 'Saved Songs',
        screen: 'Cumulus.SavedSongs',
        // icon: require('../img/two.png'),
        // selectedIcon: require('../img/two_selected.png'),
        title: 'Saved Songs'
      },
      {
        label: 'Playlists',
        screen: 'Cumulus.Playlists',
        title: 'Playlists',
      },
    ],
    appStyle: {
      orientation: 'portrait', // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
    },
    passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
    animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
  });
}

export default {
  registerScreens,
  startLogin,
  startApp,
};
