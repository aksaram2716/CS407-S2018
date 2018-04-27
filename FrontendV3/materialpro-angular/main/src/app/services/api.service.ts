import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError, retry} from 'rxjs/operators';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {Recipe} from '../../interfaces/Recipe';
import {Settings} from '../../interfaces/Settings';
import {isPlatformBrowser} from '@angular/common';
import {isNullOrUndefined} from 'util';
import {APICredentials} from '../../interfaces/Login';
import {User} from '../../interfaces/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class JustRecipesAPIService {
  headers: string[];
  apiPrefix = 'http://localhost:5005/JustRecipes/api';
  allRecipesUrl = this.apiPrefix + '/all/recipes?after=0&limit=1000';
  singleRecipeUrl = this.apiPrefix + '/all/recipe?id=';
  myRecipesUrl = this.apiPrefix + '/me/recipes?after=0&limit=1000';
  mysingleRecipeUrl = this.apiPrefix + '/me/recipe?id=';
  myFavorites = this.apiPrefix + '/me/favorites';
  getSettingsUrl = this.apiPrefix + '/me/settings';
  saveSettingsUrl = this.apiPrefix + '/me/settings';
  loginUrl = this.apiPrefix + '/all/login';
  signupUrl = this.apiPrefix + '/all/signup';
  myFavoritesUrl = this.apiPrefix + '/me/favorites';
  resetPasswordUrl = this.apiPrefix + '/all/reset-password';
  myProfileUrl = this.apiPrefix + '/me/profile';
  saveProfileUrl = this.apiPrefix + '/me/profile';
  changePasswordUrl = this.apiPrefix + '/me/change-password';
  addFavoriteUrl = this.apiPrefix + '/me/favorite';
  removeFavoriteUrl = this.apiPrefix + '/me/favorite';
  shareRecipeUrl = this.apiPrefix + '/me/share';
  saveFeedbackUrl = this.apiPrefix + '/me/feedback';
  getSearchHistoryUrl = this.apiPrefix + '/me/search-history';
  saveCommentUrl = this.apiPrefix + '/me/comment';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {}

  isValidString(string) {
    return !isNullOrUndefined(string) && string !== '';
  }

  getAuthString() {
    const userId = this.localStorage.getItem('justrecipes_userid');
    const apiToken = this.localStorage.getItem('justrecipes_apitoken');
    if (this.isValidString(userId) && this.isValidString(apiToken)) {
      return 'Basic ' + btoa(userId + ':' + apiToken);
    } else {
      return null;
    }
  }

  userIsLoggedIn() {
    return this.getAuthString() != null;
  }

  resetPassword(email: string): Observable<HttpResponse<Object>>  {
    return this.http.post<Object>(
      this.resetPasswordUrl,
      {
        email: email,
      },
      {
        observe: 'response',
      }
    )
    .pipe(
      retry(2),
      catchError(this.handleError) // then handle the error
    );
  }

  getLoginResponse(username: string, password: string): Observable<HttpResponse<APICredentials>>  {
      return this.http.post<APICredentials>(
        this.loginUrl,
        {
          email: username,
          password: password
        },
        {
          observe: 'response',
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
  }

  getSignupResponse(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ): Observable<HttpResponse<APICredentials>>  {
    return this.http.post<APICredentials>(
      this.signupUrl,
      {
        firstname: firstname,
        lastname: lastname,
        email: username,
        password: password
      },
      {
        observe: 'response',
      }
    )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
  }

  getAllRecipesResponse(searchQuery: string): Observable<HttpResponse<Recipe[]>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<Recipe[]>(
        this.myRecipesUrl,
        {
          params: {
            q: searchQuery
          },
          observe: 'response',
          headers: headers
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    } else {
      return this.http.get<Recipe[]>(
        this.allRecipesUrl,
        {
          params: {
            q: searchQuery
          },
          observe: 'response'
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  getSingleRecipeResponse(recipeId): Observable<HttpResponse<Recipe>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<Recipe>(
        this.mysingleRecipeUrl + recipeId,
        {
          headers: headers,
          observe: 'response'
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    } else {
      return this.http.get<Recipe>(
        this.singleRecipeUrl + recipeId,
        {observe: 'response'}
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  getAllFavoritesResponse(): Observable<HttpResponse<Recipe[]>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<Recipe[]>(
        this.myFavoritesUrl,
        {
          observe: 'response',
          headers: headers
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  getMyProfile(): Observable<HttpResponse<User>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<User>(
        this.myProfileUrl,
        {
          observe: 'response',
          headers: headers
        }
      )
        .pipe(
          retry(2),
          catchError(this.handleError) // then handle the error
        );
    }
  }

  saveMyProfile(
    firstname: string,
    lastname: string,
    profile_image: string
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });
      return this.http.put<Object>(
        this.saveProfileUrl,
        {
          firstname: firstname,
          lastname: lastname,
          profile_image: profile_image
        },
        {
          observe: 'response',
          headers: headers
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  changePassword(
    current_password: string,
    new_password: string
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {
      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });
      return this.http.post<Object>(
        this.changePasswordUrl,
        {
          current_password: current_password,
          new_password: new_password
        },
        {
          observe: 'response',
          headers: headers
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  getMySettingsRespone(): Observable<HttpResponse<Settings>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<Settings>(
        this.getSettingsUrl,
        {
          headers: headers,
          observe: 'response'
        }
      )
      .pipe(
        retry(1),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  saveMySettingsRespone(
    web_notification_enabled: boolean,
    email_notification_enabled: boolean,
    search_history_enabled: boolean
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.put<Object>(
        this.saveSettingsUrl,
        {
          web_notification_enabled: web_notification_enabled,
          email_notification_enabled: email_notification_enabled,
          search_history_enabled: search_history_enabled
        },
        {
          headers: headers,
          observe: 'response'
        }
      )
      .pipe(
        retry(1),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  saveCommentRespone(
    recipe_id: number,
    text: string
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.post<Object>(
        this.saveCommentUrl,
        {
          recipe_id: recipe_id,
          text: text
        },
        {
          headers: headers,
          observe: 'response'
        }
      )
      .pipe(
        retry(1),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  getFavoritesResponse(): Observable<HttpResponse<Recipe[]>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<Recipe[]>(
        this.myFavorites,
        {
          headers: headers,
          observe: 'response'
        }
      )
      .pipe(
        retry(2),
        catchError(this.handleError) // then handle the error
      );
    }
  }

  getSearchHistoryResponse(): Observable<HttpResponse<string[]>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.get<string[]>(
        this.getSearchHistoryUrl,
        {
          headers: headers,
          observe: 'response'
        }
      )
        .pipe(
          retry(2),
          catchError(this.handleError) // then handle the error
        );
    }
  }

  saveProfileToLocalStorage() {
    this.getMyProfile()
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Recipe`.
        // get object
        const currentUser = resp.body;
        this.localStorage.setItem('justrecipes_userinfo', JSON.stringify(currentUser));
        window.location.href = 'index.html';
      });
  }

  getProfileFromLocalStorage(): User {
    return JSON.parse(this.localStorage.getItem('justrecipes_userinfo'));
  }

  getFeedbackResponse(
    text: string
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {
      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });
      return this.http.post<Object>(
        this.saveFeedbackUrl,
        {
          text: text
        },
        {
          observe: 'response',
          headers: headers
        }
      )
        .pipe(
          retry(2),
          catchError(this.handleError) // then handle the error
        );
    }
  }

  getShareResponse(
    user_list: string[],
    recipe_id: number
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {
      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });
      return this.http.post<Object>(
        this.shareRecipeUrl,
        {
          user_list: user_list,
          recipe_id: recipe_id
        },
        {
          observe: 'response',
          headers: headers
        }
      )
        .pipe(
          retry(2),
          catchError(this.handleError) // then handle the error
        );
    }
  }

  addFavoriteResponse(
    recipe_id: number
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.post<Object>(
        this.addFavoriteUrl,
        {
          id: recipe_id
        },
        {
          headers: headers,
          observe: 'response'
        }
      )
        .pipe(
          retry(1),
          catchError(this.handleError) // then handle the error
        );
    }
  }

  removeFavoriteResponse(
    recipe_id: number
  ): Observable<HttpResponse<Object>>  {
    if (isPlatformBrowser(this.platformId) && this.getAuthString() != null) {

      const headers = new HttpHeaders({
        Authorization: this.getAuthString()
      });

      return this.http.delete<Object>(
        this.removeFavoriteUrl + '?id=' + recipe_id,
        {
          headers: headers,
          observe: 'response'
        }
      )
        .pipe(
          retry(1),
          catchError(this.handleError) // then handle the error
        );
    }
  }

  clearCredentials() {
    localStorage.removeItem('justrecipes_userid');
    localStorage.removeItem('justrecipes_apitoken');
    localStorage.removeItem('justrecipes_userinfo');
    this.localStorage.clear();
  }

  private handleError(error: HttpErrorResponse) {
    alert('Sorry something went wrong, please try again');
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }
}
