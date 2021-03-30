import { createReducer, Action, on } from '@ngrx/store';

import { Bookmark } from 'src/app/shared/models/bookmark.model';
import * as fromHomeActions from '../../home/state/home.actions';
import * as fromBookmarksActions from './bookmarks.actions';

export interface BookmarksState {
  list: Bookmark[];
}

export const bookmarkInitialState: BookmarksState = {
  list: [],
};

const reducer = createReducer(
  bookmarkInitialState,
  on(fromHomeActions.toggleBookmark, (state, { entity }) => ({//na página Home, recebemos uma entidade
    ...state,
    list: toggleBookmark(state.list, entity),//chamamos uma função que vai definir se essa entidade é adicionada ou removida.
  })),
  on(fromBookmarksActions.removeBookmark, (state, { id }) => ({//filtramos a lista de bookmarks, removendo o que possui o id que desejamos
    ...state,
    list: state.list.filter(b => b.id !== id),
  })),
  on(fromBookmarksActions.updateBookmarksList, (state, { list }) => ({//atualizamos a lista com as ações que foram disparadas na página de bookmarks
    ...state,
    list,
  })),
);

export function bookmarkReducer(state: BookmarksState | undefined, action: Action) {
  return reducer(state, action);
}

function toggleBookmark(list: Bookmark[], entity: Bookmark): Bookmark[] {
  if (!!list.find(bookmark => bookmark.id === entity.id)) {//se a entidade já estiver dentro da lista de bookmarks
    return list.filter(bookmark => bookmark.id !== entity.id);//filtramos, removendo ela.
  }
  return [...list, entity];//caso contrário, retornamos a lista, com a entidade nova adicionada
}
