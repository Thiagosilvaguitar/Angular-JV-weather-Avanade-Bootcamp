import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { AppState } from 'src/app/shared/state/app.reducer';
import { WeatherService } from 'src/app/shared/services/weather.service';
import * as fromDetailsActions from './details.actions';
import * as fromRouterSelectors from '../../../shared/state/router/router.selectors';

@Injectable()
export class DetailsEffects {

  loadCurrentWeather$ = createEffect(() => this.actions$
    .pipe(
      ofType(fromDetailsActions.loadWeatherDetails),//quando essa ação for disparada
      withLatestFrom(this.store.pipe(select(fromRouterSelectors.selectRouterQueryParams))),//selecionar latitude e longitude nas rotas
      mergeMap(([, queryParams]: [any, Params]) =>
        combineLatest([ //trazer a resposta da cidade e do clima com base na latitude e longitude
          this.weatherService.getCityWeatherByCoord(queryParams.lat, queryParams.lon),
          this.weatherService.getWeatherDetails(queryParams.lat, queryParams.lon),
        ])
      ),
      catchError((err, caught$) => {//disparando erro
        this.store.dispatch(fromDetailsActions.loadWeatherDetailsFailed());
        return caught$;
      }),
      map(([current, daily]) => {
        const entity = daily;
        entity.city = {...current.city, timeZone: daily.city.timeZone};
        return fromDetailsActions.loadWeatherDetailsSuccess({ entity });//retornando entidade no sucesso
      }),
    )
  );

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private weatherService: WeatherService) {
  }
}
