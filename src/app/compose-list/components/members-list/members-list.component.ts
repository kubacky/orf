import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'orf-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {
  
  @Input('members') members: FormArray;
  @Input('tickets') tickets: any[];
  membersForm: FormGroup;
  userLimit: number = +localStorage.getItem('limit');

  constructor(
    private fb: FormBuilder,
    private ns: NotificationsService
  ) { }

  ngOnInit() {
  }

  private buildMemberForm(): FormGroup {
    const member = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      role: ['', Validators.required]
    });

    if (this.tickets.length === 1) {
      const ticket = this.fb.control({
        value: this.tickets[0].name,
        disabled: true
      });

      member.setControl('type', ticket);
    }

    return member;
  }

  addMember(): void | boolean{
    let membersArray: FormArray = this.members as FormArray;
    
    if (this.userLimit !== 0 && membersArray.length === this.userLimit) {
      this.ns.info('Nie możesz przekroczyć limitu', 'Your can\'t exceed the limit');
      return false;
    }

    const newMemberForm = this.buildMemberForm();
    membersArray.push(newMemberForm);
  }

}
