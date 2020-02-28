import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinner: boolean = true;

  constructor() { }

  startSpinner(): void {
    this.spinner = true;
  }

  stopSpinner(): void {
    this.spinner = false;
  }

  getSpinner(): boolean {
    return this.spinner;
  }
}
