import { UnitSelectorSharedComponent } from '../../../../shared/components/unit selector/unit-selector.shared.component';
import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PortalOutlet, DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { CityWeather } from 'src/app/shared/models/weather.model';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import { Units } from 'src/app/shared/models/units.enum';
import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selectors';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';
import * as fromConfigSelectors from '../../../../shared/state/config/config.selectors';

@Component({
  selector: 'jv-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  cityWeather$: Observable<CityWeather>;
  cityWeather: CityWeather;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  bookmarksList$: Observable<Bookmark[]>;
  isCurrentFavorite$: Observable<boolean>;

  searchControl: FormControl;
  searchControlWithAutocomplete: FormControl;

  unit$: Observable<Units>;

  private componentDestroyed$ = new Subject();

  private portalOutlet: PortalOutlet;

  constructor(private store: Store,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
  }

  ngOnInit() {
    this.searchControl = new FormControl('', Validators.required);
    this.searchControlWithAutocomplete = new FormControl(undefined); //definindo os forms control
    
    this.searchControlWithAutocomplete.valueChanges//quando o usuário selecionar uma cidade, retornar ela.
      .pipe(takeUntil(this.componentDestroyed$))//quando o componente for destruído, será feito o unsubscribe automático
      .subscribe((value: CityTypeaheadItem) => {
        if (!!value) {//verifica se não é undefined
          this.store.dispatch(fromHomeActions.loadCurrentWeatherById({id: value.geonameid.toString()}));//caso não seja undefined, disparar ação que carrega cidade pelo ID
        }
      }); // pesquisa pelo autocomplete

    this.cityWeather$ = this.store.pipe(select(fromHomeSelectors.selectCurrentWeather)); //recebe valor armazenado no estado da aplicação
    this.cityWeather$
      .pipe(takeUntil(this.componentDestroyed$))//quando o componente for destruído, será feito o unsubscribe automático
      .subscribe(value => this.cityWeather = value); //escuta o valor do estado para refleti-lo em tela
    this.loading$ = this.store.pipe(select(fromHomeSelectors.selectCurrentWeatherLoading)); //recebe se está carregando
    this.error$ = this.store.pipe(select(fromHomeSelectors.selectCurrentWeatherError)); //recebe se deu erro

    this.bookmarksList$ = this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList)); //recebe lista de favoritos

    this.isCurrentFavorite$ = combineLatest([this.cityWeather$, this.bookmarksList$])//verifica se a cidade está nos favoritos
      .pipe(
        map(([current, bookmarksList]) => {
          if (!!current) {
            return bookmarksList.some(bookmark => bookmark.id === current.city.id); 
          }
          return false;
        }),
      );

    this.unit$ = this.store.pipe(select(fromConfigSelectors.selectUnitConfig)); //recebe a unidade selecionada no state

    this.setupPortal(); // chama a função que abre o menu de seleção de unidade 
  }

  ngOnDestroy() { //limpar estado e fechar o menu de seleção de unidades
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
    this.store.dispatch(fromHomeActions.clearHomeState());//disparando ação para limpar o estado
    this.portalOutlet.detach();//fechar menu de seleção de unidades
  }

  doSearch() { //disparando pesquisa pelo nome da cidade
    const query = this.searchControl.value;
    this.store.dispatch(fromHomeActions.loadCurrentWeather({ query }));
  }

  onToggleBookmark() { //função para adicionar cidade ao bookmark
    const bookmark = new Bookmark();
    bookmark.id = this.cityWeather.city.id;
    bookmark.name = this.cityWeather.city.name;
    bookmark.country = this.cityWeather.city.country;
    bookmark.coord = this.cityWeather.city.coord;
    this.store.dispatch(fromHomeActions.toggleBookmark({ entity: bookmark }));
  }

  private setupPortal() { //função para renderizar a seleção de unidades na navbar
    const el = document.querySelector('#navbar-portal-outlet');
    this.portalOutlet = new DomPortalOutlet(
      el,
      this.componentFactoryResolver,
      this.appRef,
      this.injector,
    );
    this.portalOutlet.attach(new ComponentPortal(UnitSelectorSharedComponent));
  }
}
