import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { ListService } from 'src/app/services/list.service';
import { Member } from 'src/app/models/member';
import { List } from 'src/app/models/list';
import { Subscription } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket';
import { Functions } from 'src/app/shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'orf-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {

  members: any = {};
  lists: List[];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private ms: MemberService,
    private ls: ListService,
    private cdr: ChangeDetectorRef,
    private f: Functions
  ) { }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getData(): void {
    const sub = this.ms.getAll().pipe(
      tap(members => this.getMembers(members)),
      flatMap(() => this.ls.getAll())
    ).subscribe(lists => {
      this.lists = lists;
      this.cdr.markForCheck();
    })

    this.subscriptions.add(sub);
  }

  private getMembers(members): void {
    const tickets = [];
    tickets.push({ name: 'Wszystkie', values: [[], [], []] });

    members.forEach(member => {
      tickets[0].values[member.status].push(member);

      const index = tickets.findIndex(el => el.name === member.ticket);
      if (index === -1) {
        tickets.push({ name: member.ticket, values: [[], [], []] }); //0 waiting, 1 active, 2 issued
        tickets[tickets.length - 1].values[member.status].push(member);
      }
      else {
        tickets[index].values[member.status].push(member);
      }
    })

    this.countTickets(tickets);
  }

  countTickets(tickets): void {
    const adv = [];
    tickets.forEach((element, index) => {
      element.count = element.values[0].length + element.values[1].length + element.values[2].length
      element.chart = [
        { name: 'Oczekujące', value: element.values[0].length },
        { name: 'Zatwierdzone', value: element.values[1].length },
        { name: 'Wydane', value: element.values[2].length }]
      
      if (index) {
        adv.push({ name: element.name, value: element.count });
      }
    });

    this.members.advanced = adv;
    this.members.details = tickets;
  }
}
