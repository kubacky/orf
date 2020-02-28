import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TicketTypesService } from 'src/app/services/ticket-types.service';
import { ListService } from 'src/app/services/list.service';
import { NotificationsService } from 'angular2-notifications';
import { MemberSocketService } from 'src/app/services/member-socket.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Subscription, forkJoin } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'orf-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, OnDestroy {

  data: any = { listId: false };
  spinner: boolean = true;
  listForm: FormGroup;
  tickets: any;
  categories: any;
  private removed: string[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private ts: TicketTypesService,
    private ls: ListService,
    private cs: CategoriesService,
    private ns: NotificationsService,
    private socket: MemberSocketService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.route.snapshot.params['id'] !== undefined) {
      this.data.listId = this.route.snapshot.params['id'];
    }

    this.socket.initSocket();
    this.getData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getData(): void {
    const fork = [
      this.cs.getAll(),
      this.ts.getAll()
    ]
    if (this.data.listId) {
      fork.push(this.ls.getList(this.data.listId))
    }

    const sub = forkJoin(fork).subscribe(res => {
      this.categories = res[0];
      this.tickets = res[1];

      this.buildForm();

      if (this.data.listId) {
        this.getList(res[2]);
      }

      this.spinner = false;
      this.cdr.markForCheck();
    })

    this.subscriptions.add(sub);
  }

  addMember(): void | boolean {
    let membersArray: FormArray = this.listForm.get('members') as FormArray;

    const newMemberForm = this.buildMemberForm();
    membersArray.push(newMemberForm);
  }

  private buildMemberForm(): FormGroup {
    const member = this.fb.group({
      id: false,
      role: '',
      name: ['', [Validators.required, Validators.minLength(3)]],
      ticket: ['', Validators.required],
      status: 1
    });

    if (this.tickets.length === 1) {
      const ticket = this.fb.control({
        value: this.tickets[0]._id,
        disabled: true
      });

      member.setControl('ticket', ticket);
    }
    return member;
  }

  private getList(list): void {
    this.listForm.get('name').setValue(list.owner.company);

    list.members.forEach((member) => {
      let members = this.listForm.get('members') as FormArray;

      const m = this.fb.group({
        id: member._id,
        name: [member.name, Validators.required],
        role: member.role,
        ticket: [member.ticket._id, Validators.required],
        status: member.status
      })

      members.push(m);
    })

    if (list.type) {
      this.listForm.get('type').setValue(list.type._id);
    }
  }

  private buildForm(): void {
    this.listForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      members: this.fb.array([]),
      agreement: true
    })
  }

  save() {
    const form = this.listForm.value;

    if (this.tickets.length === 1) {
      form.member.forEach((member) => {
        member.ticket = this.tickets[0]._id;
      });
    }

    const removedToken = this.combineToken();

    form.removed = removedToken;

    if (this.data.listId) {
      this.updateList(form);
    }
    else {
      this.createList(form);
    }
  }

  private updateList(form: any): void {
    const sub = this.ls.updateList(form, this.data.listId).subscribe((response) => {
      if (response) {
        this.socket.listUpdated(response);
        this.router.navigate(['/dashboard/moderator/lists']);
      }
    });
    this.subscriptions.add(sub);
  }

  private createList(form: any): void {
    const sub = this.ls.createList(form).subscribe((response) => {
      if (response) {
        this.ns.success('Utworzono listę');
        this.socket.newListCreated(response);
        this.router.navigate(['/dashboard/moderator/lists'])
      }
    });

    this.subscriptions.add(sub);
  }

  removeMember(index: number): void {
    const members = this.listForm.get('members') as FormArray;
    const member = members.controls[index].value;

    if (member.id) {
      this.removed.push(member.id);
    }
    members.removeAt(index);
  }

  private combineToken(): string {
    let token: string = '';
    this.removed.forEach((pos) => {
      token += pos + '_';
    });

    return token.slice(0, -1);
  }

  isNew(): boolean {
    return this.route.snapshot.params['id'] !== undefined
  }
}
