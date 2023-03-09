import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class CompleteProfileGuard implements CanActivate {
  constructor(
    private _router: Router, private _authService: AuthService, private _userService: UserService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._userService.getProfileInformation().pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        return err.status === 404 ? of(this._router.parseUrl((
            route.data['redirectProfile'] || '/complete-profile'
          ))) : of(true)
      })
    )
  }
}

