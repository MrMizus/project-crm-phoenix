import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const hasNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/(?=.*[0-9])/) > -1) return null;
  return { hasNumber: true };
};

export const hasSpecialValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/(?=.*[!@#$%^*()])/) > -1) return null;
  return { hasSpecial: true };
};

export const hasCapitalValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/(?=.*[A-Z])/) > -1) return null;
  return { hasCapital: true };
};

export const hasSmallValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  if (control.value.search(/(?=.*[a-z])/) > -1) return null;

  return { hasSmall: true };
};

export const isCheckedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control.value) return null;

  return { isChecked: true };
};

export const isPasswordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password: string = control.get('password')?.value;
  const confirmPassword: string = control.get('confirmPassword')?.value;

  if (!confirmPassword || !password) return null;
  if (password !== confirmPassword) {
    return { isMatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private _isValidSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isValid$: Observable<boolean> = this._isValidSubject.asObservable();

  readonly registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(undefined, [Validators.required]),
      email: new FormControl(undefined, [Validators.required, Validators.email]),
      password: new FormControl(undefined, [
        Validators.required,
        Validators.minLength(8),
        hasNumberValidator,
        hasSpecialValidator,
        hasCapitalValidator,
        hasSmallValidator,
      ]),
      confirmPassword: new FormControl(undefined, [Validators.required]),
      policy: new FormControl(undefined, [isCheckedValidator]),
    },
    { validators: isPasswordMatchValidator }
  );
  

  constructor(private _authService: AuthService, private _router: Router, private _cdr: ChangeDetectorRef) { }

  onRegisterFormSubmitted(registerForm: FormGroup): void {
    if (registerForm.valid) {
      this._authService
      .register({
        email: registerForm.get('email')?.value,
        password: registerForm.get('password')?.value,
      })
      .subscribe({
        next: () => {
          this._router.navigateByUrl('/verify')
        }
      });
    } else {
      this._isValidSubject.next(true)
    }
  }
  

  isInvalid(control: string): boolean {
    if (this._isValidSubject.value) return this.registerForm.get(control)!.invalid
    return this.registerForm.get(control)?.touched ?  this.registerForm.get(control)!.invalid : false
  }

  navToRegister(): void {
    this._router.navigate(['/auth/login'])
  }
}
