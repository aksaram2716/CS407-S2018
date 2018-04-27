import { Routes } from '@angular/router';

import { ForgotComponent } from './forgot/forgot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AuthenticationRoutes: Routes = [
    {
      path: '',
      children: [{
        path: 'login',
        component: LoginComponent
    },
    {
      path: 'forgot',
      component: ForgotComponent
    },
    {
      path: 'login',
      component: LoginComponent
    }, {
      path: 'register',
      component: RegisterComponent
    }]
  }
];
