import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

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

  toggleProfileMenu() {
    let isShow: boolean;
    this._collapsedSubject.value ? isShow = false : isShow = true
    this.collapsed$.pipe(
      take(1),
      tap(() => this._collapsedSubject.next(isShow))
    ). subscribe()
  }
}
