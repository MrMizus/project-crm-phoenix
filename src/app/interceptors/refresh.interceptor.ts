import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private _storage: Storage, private _authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const token = this._storage.getItem('refreshToken');
        if (err.status === 403 && err.error.message === 'Token is invalid' && token) {
          return this._authService.refreshToken(token).pipe(
            switchMap((credentials) => {
              const newRequest = request.clone({ setHeaders: { Authorization: `Bearer ${credentials.accessToken}`}});
              return next.handle(newRequest)
            })
          )
        }
        return throwError(() => err)
      })
    )
  }
  
}
