import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this._userService.getMeInformation().pipe(
      take(1),
      switchMap((data) => {
        return data.data.user.context.email_verified
          ? of(true)
          : of(
              this._router.parseUrl(
                route.data['redirectUrlEmail'] || '/verify'
              )
            );
      })
    );
  }
}
