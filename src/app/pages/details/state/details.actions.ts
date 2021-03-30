import { createAction, props } from '@ngrx/store';

import { CityDailyWeather } from '../../../shared/models/weather.model';

export const loadWeatherDetails = createAction('[Details] Load Weather Details');//ação para disparar o carregamento dos detalhes da cidade

export const loadWeatherDetailsSuccess = createAction(//em caso de sucesso da função acima, essa função é disparada com a CityDailyWeather correspondente
  '[Details] Load Weather Details Success',
  props<{ entity: CityDailyWeather }>(),
);

export const loadWeatherDetailsFailed = createAction('[Details] Load Weather Details Failed'); //disparado em caso de falha
