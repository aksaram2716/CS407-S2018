import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {SettingsComponent} from './settings.component';
import {SettingsRoutes} from './settings.routing';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
      FlexLayoutModule,
    RouterModule.forChild(SettingsRoutes)

  ],
  declarations: [
    SettingsComponent
  ]
})

export class SettingsModule {}
