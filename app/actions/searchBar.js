import * as types from './types';

export function searchBarFocus() {
  return {
    type: types.SEARCH_BAR_FOCUS,
  };
}

export function searchBarBlur() {
  return {
    type: types.SEARCH_BAR_BLUR,
  };
}
