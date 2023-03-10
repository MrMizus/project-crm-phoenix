import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeadsModel, LeadsModelData } from '../models/leads.model';
import { map, Observable, tap } from 'rxjs';
import { ActivitiesModel, ActivitiesModelData } from '../models/activities.model';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  constructor(private _httpClient: HttpClient) {
  }

  public getLeads(): Observable<LeadsModelData[]> {
    return this._httpClient.get<LeadsModel>(`https://us-central1-courses-auth.cloudfunctions.net/leads`).pipe(
        map((data) => data.data.map((item) => item)))
  }

  public getActivities(): Observable<ActivitiesModelData[]> {
    return this._httpClient.get<ActivitiesModel>(`https://us-central1-courses-auth.cloudfunctions.net/leads/activities`).pipe(
        map((data) => data.data.map((item) => item)));
  }

  creatLead(lead: LeadsModelData): Observable<void> {
    return this._httpClient.post<void>('https://us-central1-courses-auth.cloudfunctions.net/leads', { data: lead });
  }
}
