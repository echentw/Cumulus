import { Navigation } from 'react-native-navigation';

import LoginContainer from './containers/LoginContainer';
import SearchContainer from './containers/SearchContainer';
import SideMenuContainer from './containers/MenuContainer';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('Cumulus.LoginContainer', () => LoginContainer, store, Provider);
  Navigation.registerComponent('Cumulus.SearchContainer', () => SearchContainer, store, Provider);
  Navigation.registerComponent('Cumulus.SideMenuContainer', () => SideMenuContainer, store, Provider);
}
