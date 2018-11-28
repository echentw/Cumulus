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
        label: 'EXPORT',
        screen: 'Cumulus.Export',
        icon: require('./img/export24x24.png'),
        title: 'EXPORT',
        navigatorStyle: {
          navBarTextColor: 'white',
          navBarButtonColor: 'white',
          navBarBackgroundColor: 'rgb(50, 50, 50)',
        },
      },
      {
        label: 'Search',
        screen: 'Cumulus.Search',
        icon: require('./img/search16x16.png'),
        navigatorStyle: {
          navBarTextColor: 'white',
          navBarButtonColor: 'white',
          navBarBackgroundColor: 'rgb(50, 50, 50)',
          navBarCustomView: 'Cumulus.SearchBar',
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
          navBarButtonColor: 'white',
          navBarBackgroundColor: 'rgb(50, 50, 50)',
        },
      },
      {
        label: 'Playlists',
        screen: 'Cumulus.Playlists',
        icon: require('./img/playlist24x24.png'),
        title: 'Playlists',
        navigatorStyle: {
          navBarTextColor: 'white',
          navBarButtonColor: 'white',
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
