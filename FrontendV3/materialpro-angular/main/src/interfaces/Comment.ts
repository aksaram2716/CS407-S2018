import {User} from './User';

export interface Comment {
  id: number;
  recipe_id: number;
  text: string;
  last_modified: string;
  owner: User;
}
