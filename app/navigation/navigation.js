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
        navigatorStyle: {
          navBarHidden: true,
          navBarTextColor: 'white',
          navBarBackgroundColor: 'rgb(50, 50, 50)',
        },
        title: 'Search',
      },
      {
        label: 'Saved Songs',
        screen: 'Cumulus.SavedSongs',
        icon: require('./img/music24x24.png'),
        title: 'Saved Songs',
        navigatorStyle: {
          navBarTextColor: 'white',
          navBarBackgroundColor: 'rgb(50, 50, 50)',
        },
      },
      {
        label: 'Playlists',
        screen: 'Cumulus.Playlists',
        title: 'Playlists',
        navigatorStyle: {
          navBarTextColor: 'white',
          navBarBackgroundColor: 'rgb(50, 50, 50)',
        },
      },
    ],
    tabsStyle: {
      tabBarButtonColor: 'rgb(100, 100, 100)',
      tabBarSelectedButtonColor: 'white',
      tabBarBackgroundColor: 'rgb(50, 50, 50)',
      initialTabIndex: 0,
    },
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
