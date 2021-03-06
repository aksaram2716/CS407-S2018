import {Component, AfterViewInit, Inject} from '@angular/core';
import {JustRecipesAPIService} from '../services/api.service';
import {Recipe} from '../../interfaces/Recipe';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  headers: string[];
  recipes: Recipe[] = [];
  sanitizedQuery = '';
  isUserLoggedIn = false;
  shareText = '';

  constructor(
    private _justRecipesAPIService: JustRecipesAPIService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    };
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
    this.route.params.subscribe(params => {
      this.showAllRecipesResponse();
    });
  }

  showAllRecipesResponse() {
    let searchQuery = this.route.snapshot.queryParams['q'];
    if (searchQuery != null && searchQuery.length > 0) {
      this.sanitizedQuery = decodeURI(searchQuery);
    } else {
      searchQuery = '';
    }

    this._justRecipesAPIService.getAllRecipesResponse(searchQuery)
    // resp is of type `HttpResponse<Config>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // get array
        this.recipes = resp.body;
      });
  }

  ngAfterViewInit() {
    this.showAllRecipesResponse();
    this.isUserLoggedIn = this._justRecipesAPIService.userIsLoggedIn();
  }

  viewRecipe(recipeId): void {
    this.router.navigate(['recipe'], {
      queryParams: {
        id: recipeId
      }
    });
  }

  clearSearch(): void {
    this.sanitizedQuery = '';
    this.router.navigate(['home'], {
      queryParams: {
        q: ''
      }
    });
  }

  toggleFavorite(recipe: Recipe) {
    if (!this.isUserLoggedIn) {
      alert('Please login first to be able to favorite this recipe');
    } else {
      if (recipe.is_favorite) {
        this._justRecipesAPIService.removeFavoriteResponse(recipe.id)
          .subscribe(resp => {
          // display its headers
          const keys = resp.headers.keys();
          this.headers = keys.map(key =>
            `${key}: ${resp.headers.get(key)}`);

          recipe.is_favorite = false;
        });
      } else {
        this._justRecipesAPIService.addFavoriteResponse(recipe.id)
          .subscribe(resp => {
            // display its headers
            const keys = resp.headers.keys();
            this.headers = keys.map(key =>
              `${key}: ${resp.headers.get(key)}`);

            recipe.is_favorite = true;
          });
      }
    }
  }

  shareRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: '250px',
      data: { shareText: this.shareText }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.shareText = result;

      const listOfEmails = this.shareText.split(';');
      const cleanList = [];

      for (const email of listOfEmails) {
        const str = email.trim();
        if (str == null || str === '') {
          continue;
        }
        cleanList.push(str);
      }

      this._justRecipesAPIService.getShareResponse(cleanList, recipe.id)
        .subscribe(resp => {
          // display its headers
          const keys = resp.headers.keys();
          this.headers = keys.map(key =>
            `${key}: ${resp.headers.get(key)}`);
        });
    });
  }
}

@Component({
  selector: 'app-share-dialog',
  templateUrl: 'share.dialog.html',
})
export class ShareDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
