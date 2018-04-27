import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RecipeComponent } from './recipe.component';
import { RecipeRoutes } from './recipe.routing';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
      FlexLayoutModule,
    RouterModule.forChild(RecipeRoutes)
  ],
  declarations: [ RecipeComponent ]
})

export class RecipeModule {}
