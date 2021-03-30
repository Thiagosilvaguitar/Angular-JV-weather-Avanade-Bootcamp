import { createAction, props } from '@ngrx/store';

import { Bookmark } from 'src/app/shared/models/bookmark.model';

export const removeBookmark = createAction(//ação para remover bookmark
  '[Bookmarmark] Remove Bookmark',
  props<{ id: number }>(),
);

export const toggleBookmarById = createAction(//ação para adicionar/remover do bookmark. exemplo: se está nos favoritos, essa ação removerá e se não estiver, ele adicionará
  '[Bookmarks] Toggle Bookmarks By Id',
  props<{ id: number }>(),
);

export const updateBookmarksList = createAction( //atualizar bookmarks no state
  '[Bookmarks] Update Bookmarks List',
  props<{ list: Bookmark[] }>(),
);
