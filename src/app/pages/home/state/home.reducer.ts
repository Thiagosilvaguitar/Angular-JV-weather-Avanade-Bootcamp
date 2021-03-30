import { createReducer, Action, on } from '@ngrx/store'

import * as fromHomeActions from './home.actions';

export interface HomeState {
  entity: any;
  loading: boolean;
  error: boolean;
}

export const homeInitialState: HomeState = {
  entity: undefined,
  loading: false,
  error: false,
}

const reducer = createReducer(
  homeInitialState,
  on(fromHomeActions.clearHomeState, () => homeInitialState), //em caso da ação clear ser disparada, home recebe o estado inicial
  on(
    fromHomeActions.loadCurrentWeather,
    fromHomeActions.loadCurrentWeatherById, //ao disparar qualquer uma dessas duas ações, setar loading para true e error para false
    state => ({
      ...state,
      loading: true,
      error: false,
    }),
  ),
  on(fromHomeActions.loadCurrentWeatherSuccess, (state, { entity }) => ({//ao finalizar essa ação, adicionar a entidade encontrada na API e setar o loading para false
    ...state,
    entity,
    loading: false,
  })),
  on(fromHomeActions.loadCurrentWeatherFailed, state => ({//ao finalizar essa ação, setar loading para false e o error para true.
    ...state,
    loading: false,
    error: true,
  })),
);

export function homeReducer(state: HomeState | undefined, action: Action): HomeState {
  return reducer(state, action);
}
