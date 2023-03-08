import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
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
    return of(true)
    // return this._userService.getProfileInformation().pipe(
    //   catchError((err: HttpErrorResponse) => {
    //     return err.status === 404 ? this._router.parseUrl((
    //         route.data['redirectLogIn'] || '/auth/login'
    //       )) : true
    //   })
      
    // )
  }
}
