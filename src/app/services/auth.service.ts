import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CredentialsModel, CredentialsResponse, CredentialsResponseData } from '../models/credentials.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private _httpClient: HttpClient, private _storage: Storage) {
  }



  login(credentials: CredentialsModel): Observable<CredentialsResponseData> {
    return this._httpClient.post<CredentialsResponse>('https://us-central1-courses-auth.cloudfunctions.net/auth/login', { data: credentials })
      .pipe(
        map((data) => data.data),
        tap((data) => {
          this.saveUserStorage(data)
        })
      )
  }

  private saveUserStorage(data: CredentialsResponseData): void {
    this._storage.setItem('id', data.id);
    this._storage.setItem('accessToken', data.accessToken);
    this._storage.setItem('refreshToken', data.refreshToken);
    this._storage.setItem('refreshToken', data.refreshToken);
  }

  register(credentials: CredentialsModel): Observable<void> {
    return this._httpClient.post<void>('https://us-central1-courses-auth.cloudfunctions.net/auth/register2', { data: credentials });
  }
}
