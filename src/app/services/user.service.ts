import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private _httpClient: HttpClient) {
  }

  public getMeInformation(): Observable<UserResponse> {
    return this._httpClient.get<UserResponse>(`https://us-central1-courses-auth.cloudfunctions.net/auth/me`);
  }
}
