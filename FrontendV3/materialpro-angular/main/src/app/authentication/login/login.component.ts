import {Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {JustRecipesAPIService} from '../../services/api.service';
import {APICredentials} from '../../../interfaces/Login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  apiCredentials: APICredentials = {
    user_id: '',
    api_token: ''
  };
  headers: string[];

  public form: FormGroup;
  constructor(
    private _justRecipesAPIService: JustRecipesAPIService,
    private fb: FormBuilder,
    private router: Router,
    @Inject('LOCALSTORAGE') private localStorage: any
  ) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      uname: [null , Validators.compose ( [ Validators.required ] )] , password: [null , Validators.compose ( [ Validators.required ] )]
    } );
  }

  onSubmit() {
    this._justRecipesAPIService.getLoginResponse(this.form.controls['uname'].value, this.form.controls['password'].value)
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        if (resp.status === 200) {
          this.apiCredentials = resp.body;

          this.localStorage.setItem('justrecipes_userid', this.apiCredentials.user_id);
          this.localStorage.setItem('justrecipes_apitoken', this.apiCredentials.api_token);
          this._justRecipesAPIService.saveProfileToLocalStorage();
        } else {
          alert('Invalid credentials');
        }
      });
  }
}
