import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const leastTenWorldsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.split(' ').filter((item: any) => item != '').length >= 10) return null;
  return { leastTenWorld: true };
};

export const leastTwoSentenceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/.*\..*\..*/) > -1) return null;
  return { leastTwoSentence: true };
};

@Component({
  selector: 'app-complete-profile',
  styleUrls: ['./complete-profile.component.scss'],
  templateUrl: './complete-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompleteProfileComponent {
  isValid: boolean = false
  readonly bioForm: FormGroup = new FormGroup({ bio: new FormControl('', [leastTenWorldsValidator, leastTwoSentenceValidator, Validators.required]) });

  constructor(private _router: Router, private _authService: AuthService, private _cdr: ChangeDetectorRef) {
  }

  public onRegisterFormSubmitted(bioForm: FormGroup): void {
    if (bioForm.valid) {
      console.log("valid")
      this._authService
        .completeProfile({
          content: bioForm.get('bio')?.value,
        })
        .subscribe({
          next: () => {
            this._router.navigateByUrl('/leads')
          },
          error: () => {
            this.bioForm.setErrors({ invalidCredentials: "Something went wrong while sending" });
            this._cdr.detectChanges();
          },
        });
    } else {
      this.isValid = true
    }
  }

  public  isInvalid(control: string): boolean {
    if (this.isValid) return this.bioForm.get(control)!.invalid
    return this.bioForm.get(control)?.touched ? this.bioForm.get(control)!.invalid : false
  }
}
