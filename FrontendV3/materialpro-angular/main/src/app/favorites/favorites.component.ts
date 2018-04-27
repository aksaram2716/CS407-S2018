import { Component, AfterViewInit } from '@angular/core';
import {JustRecipesAPIService} from '../services/api.service';
import {Recipe} from '../../interfaces/Recipe';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ShareDialogComponent} from '../home/home.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements AfterViewInit {
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
      this.showAllFavoritesResponse();
    });
  }

  showAllFavoritesResponse() {
    let searchQuery = this.route.snapshot.queryParams['q'];
    if (searchQuery != null && searchQuery.length > 0) {
      this.sanitizedQuery = decodeURI(searchQuery);
    } else {
      searchQuery = '';
    }

    this._justRecipesAPIService.getAllFavoritesResponse()
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
    this.showAllFavoritesResponse();
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
