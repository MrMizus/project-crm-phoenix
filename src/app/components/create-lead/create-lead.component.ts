import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivitiesModelData } from '../../models/activities.model';
import { LeadsService } from '../../services/leads.service';
import { AuthService } from '../../services/auth.service';

export const isUrlValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) > -1) return null;
  return { isUrl: true };
};

export const isLinkedinUrlValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]linkedin+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/) > -1) return null;
  return { isUrl: true };
};

export const isCheckedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (Object.values(control.value).includes(true)) {
    return null;
  }

  return { isChecked: true };
};

export const isPositiveValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control.value > 0) return null;
  return { isPositive: true };
};

@Component({
  selector: 'app-create-lead',
  styleUrls: ['./create-lead.component.scss'],
  templateUrl: './create-lead.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLeadComponent {
  private _collapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public collapsed$: Observable<boolean> = this._collapsedSubject.asObservable();

  private _isValidSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isValid$: Observable<boolean> = this._isValidSubject.asObservable();

  readonly activities$: Observable<ActivitiesModelData[]> =
    this._leadsService.getActivities().pipe(
      tap(data => this.setControls(data))
    )

  private setControls(activitiesId: ActivitiesModelData[]): void {
    activitiesId.forEach(
      tag => this.activitiesIdForm.addControl(
        tag.id, new FormControl(false),
      )
    )
  }
  public logout(): void {
    this._authService.logout()
    this._router.navigateByUrl('/logged-out');
  }

  public toggleProfileMenu(): void {
    let isShow: boolean;
    this._collapsedSubject.value ? isShow = false : isShow = true
    this.collapsed$.pipe(
      take(1),
      tap(() => this._collapsedSubject.next(isShow))
    ).subscribe()
  }

  readonly activitiesIdForm: FormGroup = new FormGroup({}, [isCheckedValidator])

  readonly leadForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    websiteLink: new FormControl('', [Validators.required, isUrlValidator]),
    linkedinLink: new FormControl('', [Validators.required, isLinkedinUrlValidator]),
    location: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    annualRevenue: new FormControl('', [Validators.required]),
    activityIds: this.activitiesIdForm,
    total: new FormControl('', [Validators.required, isPositiveValidator]),
    dev: new FormControl('', [Validators.required, isPositiveValidator]),
    fe: new FormControl('', [Validators.required, isPositiveValidator]),
    active: new FormControl(''),
    junior: new FormControl(''),
    talentProgram: new FormControl(''),
  });

  public onRegisterFormSubmitted(leadForm: FormGroup): void {
    if (leadForm.valid) {
      this._leadsService
        .creatLead({
          activityIds: Object.keys(this.activitiesIdForm.value).reduce((acc: string[], curr: string) => {
            if (this.activitiesIdForm.value[curr]) {
              return [...acc, curr]
            } else {
              return acc
            }
          }, []),
          annualRevenue: leadForm.get('annualRevenue')?.value,
          companySize: {
            dev: leadForm.get('dev')?.value,
            fe: leadForm.get('fe')?.value,
            total: leadForm.get('total')?.value,
          },
          hiring: {
            active: leadForm.get('active')?.value,
            junior: leadForm.get('junior')?.value,
            talentProgram: leadForm.get('talentProgram')?.value,
          },
          location: leadForm.get('location')?.value,
          name: leadForm.get('name')?.value,
          websiteLink: leadForm.get('websiteLink')?.value,
          industry: leadForm.get('industry')?.value,
          linkedinLink: leadForm.get('linkedinLink')?.value,
        }).subscribe({
          next: () => {
            console.log('działa')
            this._router.navigateByUrl('/leads')
          }
        })

    } else {
      this._isValidSubject.next(true)
    }
  }

  public isInvalid(control: string): boolean {
    if (this._isValidSubject.value) return this.leadForm.get(control)!.invalid
    return this.leadForm.get(control)?.touched ? this.leadForm.get(control)!.invalid : false
  }

  public backToLeads(): void {
    this._router.navigateByUrl('/leads')
  }

  constructor(private _leadsService: LeadsService, private _router: Router, private _authService: AuthService) { }
}
