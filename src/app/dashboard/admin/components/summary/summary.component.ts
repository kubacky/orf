import { Component, OnInit } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'orf-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  summary: any[];
  subscription: Subscription = new Subscription();

  constructor(
    private ms: MemberService
  ) { }

  ngOnInit() {
    this.getSummary():
  }

  private getSummary(): void {
    const sub = this.ms.getSummary().subscribe(summary => {
      console.log(summary);
      this.summary = summary;
    })
  }

}
