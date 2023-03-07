import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly loginForm: FormGroup = new FormGroup({ email: new FormControl('', [Validators.required, Validators.email]), password: new FormControl('', [Validators.required]) });

  constructor(private _router: Router, private _authService: AuthService, private _cdr: ChangeDetectorRef) {
  }

  isInvalidEmail(): boolean {
    return this.loginForm.get('email')?.value === '' ? false: this.loginForm.get('email')!.invalid
  }

  navToRegister(): void {
    this._router.navigate(['/auth/register'])
  }

  onLoginFormSubmitted(loginForm: FormGroup): void {
    this._authService.login({
      email: loginForm.get('email')?.value,
      password: loginForm.get('password')?.value
    }).subscribe({
      next: () => this._router.navigate(['/leads']),
      error: () => {
        this.loginForm.setErrors({ invalidCredentials: "Wrong password or email" });
        this._cdr.detectChanges();
      },
    });
  }
}
