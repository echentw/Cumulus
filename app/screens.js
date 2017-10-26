import { Navigation } from 'react-native-navigation';

import LoginContainer from './containers/LoginContainer';
import SearchContainer from './containers/SearchContainer';
import SideMenuContainer from './containers/MenuContainer';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('Cumulus.Login', () => LoginContainer, store, Provider);
  Navigation.registerComponent('Cumulus.Search', () => SearchContainer, store, Provider);
  Navigation.registerComponent('Cumulus.SideMenu', () => SideMenuContainer, store, Provider);
}
