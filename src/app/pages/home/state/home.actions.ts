import { createAction, props } from '@ngrx/store';

import { Bookmark } from 'src/app/shared/models/bookmark.model';

export const loadCurrentWeather = createAction( //carregar clima pelo nome da cidade
  '[Home] Load Current Weather',
  props<{ query: string }>(),
);

export const loadCurrentWeatherById = createAction(//carregar clima pelo id da cidade(usado pela pesquisa com autocomplete)
  '[Home] Load Current Weather By Id',
  props<{ id: string }>(),
);

export const loadCurrentWeatherSuccess = createAction(//em caso de sucesso na pesquisa, essa ação é disparada
  '[Weather API] Load Current Weather Success',
  props<{ entity: any }>(),
);

export const loadCurrentWeatherFailed = createAction(//em caso de falha na pesquisa, essa ação é disparada 
  '[Weather API] Load Current Weather Failed',
);

export const toggleBookmark = createAction(//ação disparada para quando o usuário quer remover ou adicionar aos favoritos
  '[Home] Toggle Bookmark',
  props<{ entity: Bookmark }>(),
);

export const clearHomeState = createAction('[Home] Clear Home State'); //ação disparada para limpar o state
