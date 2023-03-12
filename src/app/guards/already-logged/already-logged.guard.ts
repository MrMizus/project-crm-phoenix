import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class AlreadyLoggedGuard implements CanActivate {
  constructor(
    private _router: Router, private _authService: AuthService, private _userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const auth = this._authService.loggedIn$.pipe(
      map((isLoggedIn) => {
        return !isLoggedIn ? false : true
      })
    );

    const profile = this._userService.getProfileInformation().pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        return err.status === 404 ? of(false) : of(true)
      })
    )

    return combineLatest([
      auth,
      profile
    ]).pipe(
      map(([auth, profile]) => {
        return (auth  && profile) ? this._router.parseUrl((
            route.data['redirectLeads'] || '/leads'
          )): true
      })
    )
  }
}
