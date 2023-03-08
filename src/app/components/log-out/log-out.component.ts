import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  styleUrls: ['./log-out.component.scss'],
  templateUrl: './log-out.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogOutComponent {
  constructor(private _router: Router) {
  }

  public logout(): void {
    this._router.navigateByUrl('/auth/login');
  }
}
