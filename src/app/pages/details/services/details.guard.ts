import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable()
export class DetailsGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (route.queryParams.lat && route.queryParams.lon) {//verifica a existência da latitude e longitude nos parametros
      return true;//caso seja verdade, retornar true
    }
    return this.router.createUrlTree(['']);//redireciona o usuário para a Home em caso da query não estar no padrão desejado
  }
}
