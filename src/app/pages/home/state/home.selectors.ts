import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HomeState } from './home.reducer';

export const selectHomeState = createFeatureSelector('home');

export const selectCurrentWeather = createSelector(//retornar entidade no state
  selectHomeState,
  (homeState: HomeState) => homeState.entity,
);

export const selectCurrentWeatherLoading = createSelector(//retornar loading
  selectHomeState,
  (homeState: HomeState) => homeState.loading,
);

export const selectCurrentWeatherError = createSelector(// retornar error
  selectHomeState,
  (homeState: HomeState) => homeState.error,
);
