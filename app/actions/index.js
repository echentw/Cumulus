import * as UserActions from './user';
import * as PlayerActions from './player';
import * as SongInfoActions from './songInfo';

export const ActionCreators = Object.assign({},
  UserActions,
  PlayerActions,
  SongInfoActions,
);
