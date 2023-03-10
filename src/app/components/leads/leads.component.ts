import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LeadsQueryModel } from '../../query-model/leads.queryModel';
import {  ActivitiesModelData } from '../../models/activities.model';
import {  LeadsModelData } from '../../models/leads.model';
import { AuthService } from '../../services/auth.service';
import { LeadsService } from '../../services/leads.service';

@Component({
  selector: 'app-leads',
  styleUrls: ['./leads.component.scss'],
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsComponent {
  test: boolean = false
  private _collapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public collapsed$: Observable<boolean> = this._collapsedSubject.asObservable();


  readonly leads$: Observable<LeadsQueryModel[]> = combineLatest([
    this._leadsService.getLeads(),
    this._leadsService.getActivities()
  ]).pipe(
    map(([leads, activeities]) => {
      const activeitiesMap = activeities.reduce((a, c) => ({ ...a, [c.id]: c }),
        {} as Record<string, ActivitiesModelData>);
      return leads.map((lead) => this.mapToLeadsQueryModel(lead, activeitiesMap))
    })
  )

  constructor(private _authService: AuthService, private _router: Router, private _leadsService: LeadsService) {
  }

  toggleProfileMenu():void {
    let isShow: boolean;
    this._collapsedSubject.value ? isShow = false : isShow = true
    this.collapsed$.pipe(
      take(1),
      tap(() => this._collapsedSubject.next(isShow))
    ).subscribe()
  }

  testF() {
    this.test = true
  }

  public logout(): void {
    this._authService.logout()
    this._router.navigateByUrl('/logged-out');
  }

  mapToLeadsQueryModel(
    leads: LeadsModelData,
    activities: Record<string, ActivitiesModelData>
  ): LeadsQueryModel {
    return {
      annualRevenue: leads.annualRevenue,
      companySize: leads.companySize,
      hiring: leads.hiring,
      location: leads.location,
      name: leads.name,
      websiteLink: leads.websiteLink,
      industry: leads.industry,
      linkedinLink: leads.linkedinLink,
      activityIds: leads.activityIds.map((id) => activities[id]),
    }
  }
}
