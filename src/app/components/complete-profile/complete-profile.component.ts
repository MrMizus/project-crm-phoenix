import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const leastTenWorldsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.split(' ').filter((item: any) =>  item != '').length >= 10) return null;
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
  readonly bioForm: FormGroup = new FormGroup({ bio: new FormControl('', [leastTenWorldsValidator, leastTwoSentenceValidator]) });

  onRegisterFormSubmitted(bioForm: FormGroup): void {
  }

  isInvalid(control: string): boolean {
    if (this.isValid) return this.bioForm.get(control)!.invalid
    return this.bioForm.get(control)?.touched ?  this.bioForm.get(control)!.invalid : false
  }
}
