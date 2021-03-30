import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home/containers/home/home.page';
import { BookmarksPage } from './pages/bookmarks/containers/bookmarks/bookmarks.page';

const routes: Routes = [ //rotas da aplicação
  { path: '', component: HomePage },//na raiz chamamos a homepage
  { path: 'bookmarks', component: BookmarksPage },// na /bookmarks chamamos a página de favoritos
  { path: 'details', loadChildren: () => import('./pages/details/details.module').then(m => m.DetailsModule) }, //chamamos a details sempre com os queryparams
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
