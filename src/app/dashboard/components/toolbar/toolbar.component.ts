import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'orf-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input('sidenav') sidenav: any;

  username: String = localStorage.getItem('username');

  constructor(
    private as: AuthService
  ) {
  }

  ngOnInit() {
  }

  logout(): void {
    this.as.logout();
  }

}
