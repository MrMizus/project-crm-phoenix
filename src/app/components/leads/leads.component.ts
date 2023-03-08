import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leads',
  styleUrls: ['./leads.component.scss'],
  templateUrl: './leads.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsComponent {
  private _collapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public collapsed$: Observable<boolean> = this._collapsedSubject.asObservable();

  isValid: boolean = false

  constructor(private _authService: AuthService, private _router: Router) {
  }

  toggleProfileMenu() {
    let isShow: boolean;
    this._collapsedSubject.value ? isShow = false : isShow = true
    this.collapsed$.pipe(
      take(1),
      tap(() => this._collapsedSubject.next(isShow))
    ).subscribe()
  }

  public logout(): void {
    this._authService.logout()
    this._router.navigateByUrl('/auth/login');
  }
}
