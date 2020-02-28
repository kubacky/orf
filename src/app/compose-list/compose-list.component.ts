import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TicketTypesService } from 'src/app/services/ticket-types.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/auth/auth.service';
import { ListService } from 'src/app/services/list.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'orf-compose-list',
  templateUrl: './compose-list.component.html',
  styleUrls: ['./compose-list.component.scss']
})
export class ComposeListComponent implements OnInit {

  registerForm: FormGroup;
  tickets: any[];
  list: boolean = false;

  username: string = localStorage.getItem('username');
  userLimit: number = +localStorage.getItem('limit');

  constructor(
    private fb: FormBuilder,
    private ns: NotificationsService,
    private ts: TicketTypesService,
    private ls: ListService,
    private as: AuthService,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.socket.initSocket();
    this.getTicketTypes();
    this.getList();
    this.socket.initSocket();
  }

  private buildForm(): void {
    this.registerForm = this.fb.group({
      members: this.fb.array([]),
      agreement: false
    });
  }

  save(): void {
    const register = this.registerForm.value;

    if (this.tickets.length === 1) {
      register.member.forEach((member) => {
        member.type = this.tickets[0].name;
      });
    }

    if (!this.list) {
      this.ls.createList(register).subscribe((response) => {
        if (response.status === 'OK') {
          this.ns.success('Zapisano listę', 'Your list has been saved');
          this.buildForm();
          this.getList();
        }
      });
    }
    else {
      this.ls.updateUserList(register).subscribe((response) => {
        if (response.status === 'OK') {
          this.ns.success('Zaktualizowano dane', 'Data has been updated');
        }
      });
    }
    this.socket.memberChanged({ status: true });
  }

  isFormComplete(): boolean {
    const form = this.registerForm.value;

    if (!form.members || !form.agreement || this.registerForm.invalid) {
      return false;
    }
    return true;
  }

  private getList(): void {
    this.ls.getForUser().subscribe((data) => {
      if (data) {
        this.parseList(data);
      }
    });
  }

  private getTicketTypes(): void {
    this.ts.getForUser().subscribe((response) => {
      if (response.status === 'ERROR') {
        this.ns.error(response.title, response.message);
      }
      else {
        this.tickets = response.tickets;
      }
    })
  }

  private parseList(data): void {
    this.list = true;
    let membersArray = this.registerForm.get('members') as FormArray;

    this.registerForm.get('agreement').setValue(data.agreement);

    data.members.forEach((member) => {
      const m = this.fb.group({
        name: [member.name, Validators.required],
        type: [member.ticketType, Validators.required]
      });

      if (member.status > 0) {
        m.get('name').disable();
        m.get('type').disable();
      }
      membersArray.push(m);
    });
  }
}
