import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UserService } from '../../services/user.service';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IsAdminGuard implements CanActivate {
    constructor(private _userService: UserService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._userService.isAdmin$.pipe(
      map((role) => {
        return role
          ? true
          : this._router.parseUrl(
            route.data['redirectLeads'] || '/leads'
          );
      })
    );
  }
}
