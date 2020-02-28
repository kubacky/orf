import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';
import { TicketTypesService } from 'src/app/services/ticket-types.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';

@Component({
  selector: 'orf-edit-ticket-name',
  templateUrl: './edit-ticket-name.component.html',
  styleUrls: ['./edit-ticket-name.component.scss']
})
export class EditTicketNameComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  ticketForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditTicketNameComponent>,
    private ts: TicketTypesService,
    private fb: FormBuilder,
    private ns: NotificationsService,
    @Inject(MAT_DIALOG_DATA) private ticket: any
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buildForm(): void {
    this.ticketForm = this.fb.group({
      id: this.ticket._id,
      name: [this.ticket.name, Validators.required]
    })
  }

  save(): void {
    const ticket = this.ticketForm.value;
    const sub = this.ts.updateTicketType(ticket, this.ticket._id).subscribe((response) => {
      this.success(response);
    });

    this.subscription.add(sub);
  }

  private success(response: any): void {
    this.ns.success(response.message);
    this.dialogRef.close(true);
  }

}
