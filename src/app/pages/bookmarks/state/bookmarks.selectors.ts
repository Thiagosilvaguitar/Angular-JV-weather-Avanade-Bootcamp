import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BookmarksState } from './bookmarks.reducer';

export const selectBookmarksState = createFeatureSelector('bookmarks');

export const selectBookmarksList = createSelector(// retorna a lista do state
  selectBookmarksState,
  (bookmarksState: BookmarksState) => bookmarksState.list,
);
