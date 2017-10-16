import { combineReducers } from 'redux';

import * as playerReducer from './player';
import * as userReducer from './user';

export default combineReducers(Object.assign({},
  playerReducer,
  userReducer,
));
