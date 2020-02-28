import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  notificationsOpts: any = {
    timeOut: 5000,
    pauseOnHover: false
  }

  constructor(
    private router: Router,
    private ls: LayoutService
  ) {}

  ngOnInit() {
  }
}
