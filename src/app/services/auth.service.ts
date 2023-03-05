import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsModel } from '../models/credentials.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private _httpClient: HttpClient) {
    }
  
    create(login: CredentialsModel): Observable<void> {
      return this._httpClient.post<void>('https://us-central1-courses-auth.cloudfunctions.net/auth/login', {data: login})
    }
}
