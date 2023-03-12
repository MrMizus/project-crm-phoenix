import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getUserRole());
  public isAdmin$: Observable<boolean> = this._isAdminSubject.asObservable();

  constructor(private _httpClient: HttpClient, private _storage: Storage) {
  }

  public getMeInformation(): Observable<UserResponse> {
    return this._httpClient.get<UserResponse>(`https://us-central1-courses-auth.cloudfunctions.net/auth/me`).pipe(
      tap(() => {
        this._isAdminSubject.next(this.getUserRole())
      })
    )
  }

  public getProfileInformation(): Observable<UserResponse> {
    return this._httpClient.get<UserResponse>(`https://us-central1-courses-auth.cloudfunctions.net/auth/my-bio`)
  }

  public getUserRole(): boolean {
    if (this._storage.getItem('accessToken')) {
      const tokenRole = JSON.parse(
        atob(this._storage.getItem('accessToken')!.split('.')[1])
      ).role;

      if (tokenRole) {
        return true;
      }
      return false;
    }
    return false;
  }
}
