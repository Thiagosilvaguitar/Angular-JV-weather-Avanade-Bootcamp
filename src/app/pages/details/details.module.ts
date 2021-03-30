import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DetailsPage } from './containers/details/details.page';
import { DetailsGuard } from './services/details.guard';
import { detailsReducer } from './state/details.reducer';
import { DetailsEffects } from './state/details.effects';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { DailyWeatherComponent } from './components/daily-weather/daily-weather.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: DetailsPage, canActivate: [DetailsGuard] },//validação da rota, se passar, ir para a página de detalhes normalmente, caso contrário, ir para a página inicial
    ]),
    StoreModule.forFeature('details', detailsReducer),
    EffectsModule.forFeature([DetailsEffects]),
    ComponentsModule,
  ],
  declarations: [
    DetailsPage,
    DailyWeatherComponent,

  ],
  providers: [
    DetailsGuard,
  ],
})
export class DetailsModule {
}
