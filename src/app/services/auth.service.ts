import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CredentialsModel, CredentialsResponse, CredentialsResponseData } from '../models/credentials.model';
import { BioModel } from '../models/bio.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isUserLogged());
  public loggedIn$: Observable<boolean> = this._loggedInSubject.asObservable();

  private _hasBioSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.hasBio());
  public hasBio$: Observable<boolean> = this._hasBioSubject.asObservable();

  public logout(): void {
    this._loggedInSubject.next(false);
    this._storage.clear();
  }

  private isUserLogged(): boolean {
    return this._storage.hasOwnProperty('accessToken') ?? false;
  }

  private hasBio(): boolean {
    return this._storage.hasOwnProperty('hasBio') ?? false;
  }

  constructor(private _httpClient: HttpClient, private _storage: Storage) {
  }



  login(credentials: CredentialsModel): Observable<CredentialsResponseData> {
    return this._httpClient.post<CredentialsResponse>('https://us-central1-courses-auth.cloudfunctions.net/auth/login', { data: credentials })
      .pipe(
        map((data) => data.data),
        tap((data) => {
          this._loggedInSubject.next(true);
          this.saveUserStorage(data)
        })
      )
  }

  register(credentials: CredentialsModel): Observable<void> {
    return this._httpClient.post<void>('https://us-central1-courses-auth.cloudfunctions.net/auth/register2', { data: credentials });
  }
  completeProfile(content: BioModel): Observable<void> {
    return this._httpClient.post<void>('https://us-central1-courses-auth.cloudfunctions.net/auth/add-bio', { data: content });
  }

  private saveUserStorage(data: CredentialsResponseData): void {
    this._storage.setItem('id', data.id);
    this._storage.setItem('accessToken', data.accessToken);
    this._storage.setItem('refreshToken', data.refreshToken);
    this._storage.setItem('refreshToken', data.refreshToken);
  }
}
