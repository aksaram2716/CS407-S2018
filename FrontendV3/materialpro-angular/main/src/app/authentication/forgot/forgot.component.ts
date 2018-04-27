import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import {JustRecipesAPIService} from '../../services/api.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  headers: string[];

  public form: FormGroup;
  constructor(
    private _justRecipesAPIService: JustRecipesAPIService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      email: [ null, Validators.compose( [ Validators.required, CustomValidators.email ] ) ]
    } );
  }

  onSubmit() {
    this._justRecipesAPIService.resetPassword(
      this.form.controls['email'].value,
    )
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        if (resp.status === 200) {
          alert('Instructions to help you login are sent to the email address');
          this.router.navigate ( ['/authentication/login'] );
        }
      });
  }
}
