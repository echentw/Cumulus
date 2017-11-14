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
        icon: require('./img/search16x16.png'),
        title: 'Search',
      },
      {
        label: 'Saved Songs',
        screen: 'Cumulus.SavedSongs',
        icon: require('./img/music24x24.png'),
        title: 'Saved Songs'
      },
      {
        label: 'Playlists',
        screen: 'Cumulus.Playlists',
        title: 'Playlists',
      },
    ],
    appStyle: {
      orientation: 'portrait',
    },
    passProps: {},
    animationType: 'slide-down',
  });
}

export default {
  registerScreens,
  startLogin,
  startApp,
};
