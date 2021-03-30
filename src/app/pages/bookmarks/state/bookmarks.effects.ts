import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { withLatestFrom, mergeMap, map, catchError } from 'rxjs/operators';

import { AppState } from 'src/app/shared/state/app.reducer';
import { WeatherService } from 'src/app/shared/services/weather.service';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityWeather } from 'src/app/shared/models/weather.model';
import * as fromBookmarksActions from './bookmarks.actions';
import * as fromBookmarksSelectors from './bookmarks.selectors';

@Injectable()
export class BookmarksEffects {

  toggleBookmarksById$ = createEffect(() => this.actions$
    .pipe(
      ofType(fromBookmarksActions.toggleBookmarById),//quando essa função for disparada
      withLatestFrom(this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList))),//trazer bookmarks
      mergeMap(([{ id }, bookmarks]: [{ id: number }, Bookmark[]]) => {
        if (bookmarks.some(bookmark => bookmark.id === id)) {//se houver um id presente na lista de bookmarks, retornar bookmarks filtrado, sem o id que foi passado
          return of(bookmarks.filter(bookmark => bookmark.id !== id));
        }
        return this.weatherService.getCityWeatherById(id.toString())//caso contrário, ele busca a cidade pelo id na API
          .pipe(
            map((cityWeather: CityWeather) => {//ao retornar a cidade, instanciamos um novo bookmark e retornamos ele com as informações corretas
              const bookmark = new Bookmark();
              bookmark.id = cityWeather.city.id;
              bookmark.coord = cityWeather.city.coord;
              bookmark.name = cityWeather.city.name;
              bookmark.country = cityWeather.city.country;
              return [...bookmarks, bookmark];
            }),
          );
      }),
      map((list: Bookmark[]) => fromBookmarksActions.updateBookmarksList({list})),//chama ação para atualizar a lista de bookmarks com a lista nova
    )
  );

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private weatherService: WeatherService) {
  }
}
