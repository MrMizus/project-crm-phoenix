import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivitiesModelData } from '../../models/activities.model';
import { LeadsService } from '../../services/leads.service';

export const isUrlValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  console.log(control.value)
  if (!control.value) return null;
  if (control.value.search(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) > -1) return null;
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
  private _isValidSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isValid$: Observable<boolean> = this._isValidSubject.asObservable();

  readonly activities$: Observable<ActivitiesModelData[]> =
    this._leadsService.getActivities().pipe(
      tap(data => this.setControls(data))
    )

    setControls(activitiesId: ActivitiesModelData[]): void {
      activitiesId.forEach(
        tag => this.activitiesIdForm.addControl(
          tag.id, new FormControl(false), 
        )
      )
    }

  readonly activitiesIdForm: FormGroup = new FormGroup({}, [isCheckedValidator])

  readonly leadForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    websiteLink: new FormControl('', [Validators.required, isUrlValidator]),
    location: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    annualRevenue: new FormControl('', [Validators.required]),
    activityIds: this.activitiesIdForm,
    total: new FormControl('', [Validators.required, isPositiveValidator]),
    dev: new FormControl('', [Validators.required, isPositiveValidator]),
    fe: new FormControl('', [Validators.required, isPositiveValidator]),
    active: new FormControl('', [Validators.required]),
    junior: new FormControl('', [Validators.required]),
    talentProgram: new FormControl('', [Validators.required]),
  });

  onRegisterFormSubmitted(leadForm: FormGroup): void {
      this._leadsService
        .creatLead({
          activityIds: Object.keys(this.activitiesIdForm.value).reduce((acc: string[], curr: string) => {
            if (this.activitiesIdForm.value[curr]) {
              console.log(curr)
              return [...acc, curr]
            } else {
              console.log(this.activitiesIdForm)
              return acc
            }
          },[]),
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
        })
        .subscribe({
          complete: () => {
            this._router.navigateByUrl('/leads')
          }
        });
  }

  isInvalid(control: string): boolean {
    if (this._isValidSubject.value) return this.leadForm.get(control)!.invalid
    return this.leadForm.get(control)?.touched ?  this.leadForm.get(control)!.invalid : false
  }

  constructor(private _leadsService: LeadsService, private _router: Router) { }
}
