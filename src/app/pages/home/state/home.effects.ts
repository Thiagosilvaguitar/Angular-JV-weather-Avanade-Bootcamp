import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WeatherService } from 'src/app/shared/services/weather.service';
import { CityWeather } from 'src/app/shared/models/weather.model';
import * as fromHomeActions from './home.actions';

@Injectable()
export class HomeEffects {

  loadCurrentWeather$ = createEffect(() => this.actions$
    .pipe(
      ofType(fromHomeActions.loadCurrentWeather), // quando essa ação for disparada, executar esse effect
      mergeMap(({ query }) => this.weatherService.getCityWeatherByQuery(query)), //pela pesquisa, procurar na API algum item correspondente
      catchError((err, caught$) => {
        this.store.dispatch(fromHomeActions.loadCurrentWeatherFailed()); // em caso de erro, disparar a ação de falha
        return caught$;
      }),
      map((entity: CityWeather) => fromHomeActions.loadCurrentWeatherSuccess({ entity })),//em caso de sucesso, disparar ação de sucesso, passando a entidade encontrada.
    ),
  );

  loadCurrentWeatherById$ = createEffect(() => this.actions$
    .pipe(
      ofType(fromHomeActions.loadCurrentWeatherById),// quando essa ação for disparada, executar esse effect
      mergeMap(({ id }: { id: string }) =>
        this.weatherService.getCityWeatherById(id) //pelo ID, procurar na API algum item correspondente
      ),
      catchError((err, caught$) => {
        this.store.dispatch(fromHomeActions.loadCurrentWeatherFailed()); // em caso de erro, disparar a ação de falha
        return caught$;
      }),
      map((entity: CityWeather) => fromHomeActions.loadCurrentWeatherSuccess({entity})), //em caso de sucesso, disparar ação de sucesso, passando a entidade encontrada.
    )
  );

  constructor(private actions$: Actions,
              private store: Store,
              private weatherService: WeatherService) {
  }
}
