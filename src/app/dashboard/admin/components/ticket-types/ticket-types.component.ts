import { Component, OnInit, OnDestroy } from '@angular/core';
import { TYPES } from '../../../../shared/globals';
import { TicketTypesService } from '../../../../services/ticket-types.service';
import { SocketService } from '../../../../services/socket.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditTicketNameComponent } from 'src/app/dashboard/admin/components/dialogs/edit-ticket-name/edit-ticket-name.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/dialogs/confirm-delete/confirm-delete.component';
import { CategoriesService } from 'src/app/services/categories.service';
import { Subscription } from 'rxjs';
import { Functions } from 'src/app/shared/functions';

@Component({
  selector: 'orf-ticket-types',
  templateUrl: './ticket-types.component.html',
  styleUrls: ['./ticket-types.component.scss']
})
export class TicketTypesComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  categories: any[]
  tickets: any[];
  ticketForm: FormGroup;
  private created: boolean = false;

  private ioConnection: any;

  constructor(
    private ts: TicketTypesService,
    private cs: CategoriesService,
    private socket: SocketService,
    private fb: FormBuilder,
    private f: Functions,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getCategories();
    this.initSocket();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  private initSocket() {
    this.socket.initSocket();

    this.ioConnection = this.socket.onTicketTypeChanges()
      .subscribe((data) => {
        this.getTickets();
      });
  }

  private getCategories(): void {
    const sub = this.cs.getAll().subscribe((categories) => {
      this.categories = categories;
      this.getTickets();
    })

    this.subscriptions.add(sub);
  }

  private getTickets(): void {
    const sub = this.ts.getAll().subscribe((result) => {
      this.tickets = this.fetchTickets(result);
    });

    this.subscriptions.add(sub);
  }

  private fetchTickets(tickets): any[] {
    tickets.forEach((ticket) => {
      ticket.assoc = this.checkTicketAssociation(ticket.for);
    });
    return tickets;
  }

  private checkTicketAssociation(ticketDestiny): any {
    const assoc = [];
    this.categories.forEach((cat) => {
      const index = this.f.searchIndex(ticketDestiny, '_id' ,cat._id);
      const t = {
        id: cat._id,
        value: (index !== false) ? true : false
      }
      assoc.push(t);
    });
    return assoc;
  }

  createTicket(): void {
    this.ticketForm = this.fb.group({
      name: ['', Validators.required],
      active: true,
      for: this.buildAssociationForm()
    });
    this.created = true;
  }

  private buildAssociationForm(): FormGroup {
    const assoc = this.fb.group({});
    
    this.categories.forEach((cat) => {
      const nc = this.fb.control(false);
      assoc.setControl(cat._id, nc);
    })
    return assoc;
  }

  saveTicket(): void {
    const ticket = this.ticketForm.value;

    const sub = this.ts.createTicketType(ticket).subscribe((response) => {
      this.socket.ticketTypeChanged(ticket);
      this.created = false;
    });
    this.subscriptions.add(sub);
  }

  editName(ticket: any): void {
    const dialog = this.dialog.open(EditTicketNameComponent, {
      data: ticket
    });

    dialog.afterClosed()
      .subscribe((changes) => {
        if (changes) {
          this.socket.ticketTypeChanged(changes);
        }
      });
  }
  
  editValue(ticket: any, cat: any): void {
    const index = this.f.searchIndex(ticket.assoc, 'id', cat.id);
    
    if (index !== false) {
      const val = ticket.assoc[index].value;
      ticket.assoc[index].value = !val;
    }
    
    this.ts.updateTicketField(ticket.assoc, ticket._id).subscribe((response) => {
      this.socket.ticketTypeChanged(ticket);
    })
  }

  delete(ticket: any): void {
    this.dialog.open(
      ConfirmDeleteComponent
    ).afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.deleteTicket(ticket);
        }
      })
  }

  cancelCreating(): void {
    this.created = false;
  }

  isCreated(): boolean {
    return this.created;
  }

  private deleteTicket(ticket: any): void {

    this.ts.deleteTicketType(ticket._id).subscribe((response) => {
      this.socket.ticketTypeChanged(ticket);
    })
  }
}
