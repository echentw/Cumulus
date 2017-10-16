import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const user = createReducer(false, {
  [types.SET_USER]: (state, action) => {
    return action.user;
  },
});
