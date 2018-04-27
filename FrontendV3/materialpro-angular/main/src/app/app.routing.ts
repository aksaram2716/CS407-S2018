import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'recipe',
        loadChildren: './recipe/recipe.module#RecipeModule'
      },
      {
        path: 'material',
        loadChildren: './material-component/material.module#MaterialComponentsModule'
      },
      {
        path: 'forms',
        loadChildren: './forms/forms.module#FormModule'
      },
      {
        path: 'favorites',
        loadChildren: './favorites/favorites.module#FavoritesModule'
      },
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule'
      }
    ]
  },
  {
    path: '',
    component: AppBlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/authentication'
  }
];
