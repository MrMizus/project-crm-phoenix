import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, startWith, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LeadsQueryModel } from '../../query-model/leads.queryModel';
import { ActivitiesModelData } from '../../models/activities.model';
import { AuthService } from '../../services/auth.service';
import { LeadsService } from '../../services/leads.service';
import { UserService } from '../../services/user.service';
import { LeadsModelData } from '../../models/leads.model';

@Component({
  selector: 'app-leads',
  styleUrls: ['./leads.component.scss'],
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent {
  private _showFilterSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public showFilter$: Observable<boolean> =
    this._showFilterSubject.asObservable();

  private _collapsedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public collapsed$: Observable<boolean> =
    this._collapsedSubject.asObservable();

  private _isAdminSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this._userService.getUserRole());
  public isAdmin$: Observable<boolean> = this._isAdminSubject.asObservable();

  private _activitiesArraySubject: BehaviorSubject<string[]> =
    new BehaviorSubject<string[]>([]);
  public activitiesArray$: Observable<string[]> = this._activitiesArraySubject.asObservable();

  private _sizeArraySubject: BehaviorSubject<string[]> =
    new BehaviorSubject<string[]>([]);
  public sizeArray$: Observable<string[]> = this._sizeArraySubject.asObservable();

  private setControlsSize(size: string[]): void {
    size.forEach(
      tag => this.sizeForm.addControl(
        tag, new FormControl(false),
      )
    )
  }

  public size$: Observable<string[]> = of(['0-50', '51-100', '101-500', '501-1000', '1001+']).pipe(
    tap(data => this.setControlsSize(data))
  )

  private setControlsActivities(activitiesId: ActivitiesModelData[]): void {
    activitiesId.forEach(
      tag => this.activitiesIdForm.addControl(
        tag.id, new FormControl(false),
      ),
    )
  }

  readonly activities$: Observable<ActivitiesModelData[]> =
    this._leadsService.getActivities().pipe(
      tap(data => {
        this.setControlsActivities(data)}),
      shareReplay()
    )

  readonly sizeForm: FormGroup = new FormGroup({})

  readonly activitiesIdForm: FormGroup = new FormGroup({})

  readonly filterForm: FormGroup = new FormGroup({
    scope: this.activitiesIdForm,
    size: this.sizeForm,
  });

  readonly sizeValue$: Observable<string[]> = this.sizeForm.valueChanges.pipe(
    map((value) => {
      let valueArray = Object.keys(value).reduce((acc: string[], curr: string) => {
        if (value[curr]) {
          return [...acc, curr]
        } else {
          return acc
        }
      },[])
      return valueArray
    }),
    startWith([])
  )

  readonly activitiesIds$: Observable<string[]> = this.activitiesIdForm.valueChanges.pipe(
    map((value) => {
      let valueArray = Object.keys(value).reduce((acc: string[], curr: string) => {
        if (value[curr]) {
          return [...acc, curr]
        } else {
          return acc
        }
      },[])
      return valueArray
    }),
    startWith([])
  )

  public activitiesIdsToData(activities: string[], size: string[]): void{
    this._activitiesArraySubject.next(activities),
    this._sizeArraySubject.next(size)
  }

  readonly flitredLeads$: Observable<LeadsQueryModel[]> = combineLatest([
    this._leadsService.getLeads(),
    this.activitiesArray$,
    this.sizeArray$
  ]).pipe(
    map(([leads, activeitiesIds, size]) => leads
    .filter((lead) => activeitiesIds.some(activeitiesId =>  lead.activityIds.includes(`${activeitiesId}`)) || !activeitiesIds.length)
    .filter((lead) => {
      if (!size.length){
        return true
      }
      return size.some(range => {
        let rangeArray = range.split('-')
        if (+rangeArray[0] <= lead.companySize.total && +rangeArray[1] >= lead.companySize.total) {
          return true
        } else if (rangeArray.length === 1 && +range.split('+')[0] < lead.companySize.total){
          return true
        } else return false
      })
    })
  ));


  readonly leads$: Observable<LeadsQueryModel[]> = combineLatest([
    this.flitredLeads$,
    this._leadsService.getActivities(),
  ]).pipe(
    map(([leads, activeities]) => this.mapToLeadsQueryModel(leads, activeities)
  
  ));


  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _leadsService: LeadsService,
    private _userService: UserService
  ) {}

  public showFilter() {
    this.showFilter$
      .pipe(
        take(1),
        tap(() => this._showFilterSubject.next(true))
      )
      .subscribe();
  }

  public hideFilter() {
    this.showFilter$
      .pipe(
        take(1),
        tap(() => this._showFilterSubject.next(false))
      )
      .subscribe();
  }

  public toggleProfileMenu(): void {
    let isShow: boolean;
    this._collapsedSubject.value ? (isShow = false) : (isShow = true);
    this.collapsed$
      .pipe(
        take(1),
        tap(() => this._collapsedSubject.next(isShow))
      )
      .subscribe();
  }

  public navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }

  public logout(): void {
    this._authService.logout();
    this._router.navigateByUrl('/logged-out');
  }

  public restFilters(): void {
    this.filterForm.reset()
  }

  private mapToLeadsQueryModel(
    leads: LeadsModelData[],
    activities: ActivitiesModelData[]
  ): LeadsQueryModel[] {
    const activitiesMap = activities.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr,
      }),
      {}
    ) as Record<string, ActivitiesModelData>;

    return leads.map((lead) => {
      return {
        annualRevenue: lead.annualRevenue,
        companySize: lead.companySize,
        hiring: lead.hiring,
        location: lead.location,
        name: lead.name,
        websiteLink: lead.websiteLink,
        industry: lead.industry,
        linkedinLink: lead.linkedinLink,
        activityIds: (lead.activityIds ?? []).map((id) => activitiesMap[id].name),
      };
    })
  }
}
