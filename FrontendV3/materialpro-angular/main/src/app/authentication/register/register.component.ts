import {Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import {JustRecipesAPIService} from '../../services/api.service';
import {APICredentials} from '../../../interfaces/Login';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
const firstname = new FormControl('', Validators.required);
const lastname = new FormControl('', Validators.required);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
    @Inject('LOCALSTORAGE') private localStorage: any) {}

  ngOnInit() {
    this.form = this.fb.group( {
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: password,
      confirmPassword: confirmPassword,
      firstname: firstname,
      lastname: lastname
    } );
  }

  onSubmit() {
    this._justRecipesAPIService.getSignupResponse(
      this.form.controls['firstname'].value,
      this.form.controls['lastname'].value,
      this.form.controls['email'].value,
      this.form.controls['password'].value
    )
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
