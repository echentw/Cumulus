import { combineReducers } from 'redux';

import * as playerReducer from './player';
import * as userReducer from './user';
import * as songInfoReducer from './songInfo';

export default combineReducers(Object.assign({},
  playerReducer,
  userReducer,
  songInfoReducer,
));
