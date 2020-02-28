import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'orf-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    this.cdr.detach();
  }

  ngOnInit() {
    this.cdr.detectChanges();
  }
}
