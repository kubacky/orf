import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  loginPage$: Subject<boolean> = new Subject<boolean>();

  showLoginPage() {
    this.loginPage$.next(true);
  }

  hideLoginPage() {
    this.loginPage$.next(false);
  }
}
