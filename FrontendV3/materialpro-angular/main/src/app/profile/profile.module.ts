import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileComponent } from './profile.component';
import { ProfileRoutes } from './profile.routing';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DemoMaterialModule,
      FlexLayoutModule,
    RouterModule.forChild(ProfileRoutes)

  ],
  declarations: [ ProfileComponent ]
})

export class ProfileModule {}
