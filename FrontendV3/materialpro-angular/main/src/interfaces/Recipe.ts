import {User} from './User';
import {Comment} from './Comment';
import {Tag} from './Tag';
import {Method} from './Method';
import {Ingredient} from './Ingredient';

export interface Recipe {
  id: number;
  name: string;
  image: string;
  video_url;
  text: string;
  created: string;
  last_modified: string;
  is_favorite: boolean;
  favorite_count: number;
  owner: User;
  comments: Comment[];
  tags: Tag[];
  methods: Method[];
  ingredients: Ingredient[];
}
