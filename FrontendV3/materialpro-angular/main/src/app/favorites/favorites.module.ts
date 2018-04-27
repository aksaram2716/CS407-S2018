import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FavoritesComponent } from './favorites.component';
import { FavoritesRoutes } from './favorites.routing';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
      FlexLayoutModule,
    RouterModule.forChild(FavoritesRoutes)

  ],
  declarations: [ FavoritesComponent ]
})

export class FavoritesModule {}
