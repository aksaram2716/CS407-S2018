import {Component, AfterViewInit, Inject} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import {Recipe} from '../../interfaces/Recipe';
import {JustRecipesAPIService} from '../services/api.service';
import {User} from '../../interfaces/User';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-video-dialog',
  templateUrl: 'video.dialog.html',
})
export class VideoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements AfterViewInit {
  headers: string[];
  recipe: Recipe = {
    id: 0,
    name: '',
    image: '',
    video_url: '',
    text: '',
    created: '',
    last_modified: '',
    is_favorite: false,
    favorite_count: 0,
    owner: <User>{},
    comments: [],
    tags: [],
    methods: [],
    ingredients: []
  };

  constructor(
    private _justRecipesAPIService: JustRecipesAPIService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngAfterViewInit() {
    this.showSingleRecipeResponse();
  }

  showSingleRecipeResponse() {
    const recipeId = this.route.snapshot.queryParams['id'];

    this._justRecipesAPIService.getSingleRecipeResponse(recipeId)
    // resp is of type `HttpResponse<Recipe>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Recipe`.
        // get object
        this.recipe = resp.body;
        // alert(JSON.stringify(this.recipe));
      });
  }

  watchDemonstration() {
    window.location.href = this.recipe.video_url;
    // const dialogRef = this.dialog.open(VideoDialogComponent, {
    //   // height: '350px',
    //   width: '100%',
    //   data: {
    //     video_url: this.recipe.video_url
    //   }
    // });
  }

  addComment(event: any) {
    const value = event.target.value;
    if (value !== undefined && value != null && value !== '') {

      this._justRecipesAPIService.saveCommentRespone(this.recipe.id, value)
      // resp is of type `HttpResponse<Recipe>`
        .subscribe(resp => {
          // display its headers
          const keys = resp.headers.keys();
          this.headers = keys.map(key =>
            `${key}: ${resp.headers.get(key)}`);

          this.recipe.comments.unshift({
            id: 0,
            recipe_id: this.recipe.id,
            text: value,
            last_modified: Date.now().toString(),
            owner: {
              id: 0,
              firstname: '',
              lastname: '',
              profile_image: '',
              joined: ''
            }
          });
        });
    }
  }
}
