import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MemberService } from 'src/app/services/member.service';
import { MemberSocketService } from 'src/app/services/member-socket.service';
import { ConfirmDeleteComponent } from 'src/app/shared/components/dialogs/confirm-delete/confirm-delete.component';
import { Functions } from 'src/app/shared/functions';
import { Subscription } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'orf-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription = new Subscription();
  spinner: boolean = true;
  private query: string = '';

  columns: Array<string> = ['selected', 'status', 'name', 'ticket', 'role', 'list'];

  members: MatTableDataSource<any> = new MatTableDataSource();
  isAdmin: boolean = false;
  isModerator: boolean = false;

  selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private ms: MemberService,
    private socket: MemberSocketService,
    private f: Functions,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.checkAdmin();
    this.initSocket();
    this.getMembers();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.members.paginator = this.paginator;
    this.members.sort = this.sort;
  }

  private checkAdmin(): void {
    const permissions = localStorage.getItem('permissions');

    this.isModerator = permissions === 'admin' || permissions === 'moderator'
    this.isAdmin = permissions === 'admin';
  }


  private initSocket(): void {
    this.socket.initSocket();

    const sub1 = this.socket.onMemberStatusChanges()
      .subscribe(members => {
        this.changeMembersStatus(members);
      });
    this.subscriptions.add(sub1);

    const sub2 = this.socket.onMemberDeleted()
      .subscribe(members => {
        members.forEach(member => {
          const index = this.f.searchIndex(this.members.data, '_id', member);

          if (index !== false) {
            this.members.data.splice(index, 1);

            this.refreshTable();
          }
        })
      })
    this.subscriptions.add(sub2);

    const sub3 = this.socket.onListCreated().subscribe(list => {
      list.members.forEach(member => {
        const m = {
          _id: member._id,
          name: member.name,
          role: member.role,
          ticket: member.ticket.name,
          status: member.status,
          list: member.listRef.owner.company
        }
        this.members.data.push(m);
      });

      this.refreshTable();
    })
    this.subscriptions.add(sub3);

    const sub4 = this.socket.onListUpdated().subscribe(list => {
      list.members.forEach(member => {
        const index = this.f.searchIndex(this.members.data, '_id', member._id);
        const m = {
          _id: member._id,
          name: member.name,
          role: member.role,
          ticket: member.ticket.name,
          status: member.status,
          list: member.listRef.owner.company
        }
        
        if (index !== false) {
          this.members.data[index] = m;
        }
        else {
          this.members.data.push(m);
        }

      });

      this.refreshTable();
    })
    this.subscriptions.add(sub4);
  }

  private changeMembersStatus(members: any): void {

    members.forEach(member => {
      const index = this.f.searchIndex(this.members.data, '_id', member._id);

      if (index !== false) {
        this.members.data[index]['status'] = member.status;
      }
    })
    this.cdr.markForCheck();
  }

  private getMembers(): void {
    const sub = this.ms.getAll().subscribe(data => {
      this.members.data = data;
      this.spinner = false;
    })

    this.subscriptions.add(sub);
  }

  applyFilter(query: string): void {
    query = query.trim();
    query = query.toLowerCase();
    this.members.filter = query;
    this.query = query;
  }

  selectRow(member: any): void {
    if (member.status === 1 || member.status === 2 || this.isAdmin) {
      this.selection.toggle(member);
    }
  }

  clearSelection(): void {
    this.selection.clear();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.members.data.length;
    return numSelected == numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.clearSelection() :
      this.members.data.forEach(row => this.selectRow(row));
  }

  issuing(): void {
    if (this.selection.selected.length > 0) {
      const token = this.combineToken();
      const sub = this.ms.issuingMany(token).subscribe(response => {
        if (response.status === 'OK') {
          this.emitChanges(2)
        }
      })

      this.subscriptions.add(sub);
    }
  }

  private emitChanges(newStatus: number): void {
    const toEmit = [];
    this.selection.selected.forEach(member => {
      const m = {
        _id: member._id,
        status: newStatus
      }
      if (member.status !== 9) {
        toEmit.push(m);
      }
    })
    this.socket.memberStatusChanged(toEmit);
    this.selection.clear();
  }

  return(): void {
    if (!this.checkTicketsType(2)) {
      const token = this.combineToken();
      const sub = this.ms.returnMany(token).subscribe(response => {
        if (response.status === 'OK') {
          this.emitChanges(1);
        }
      })
      this.subscriptions.add(sub);
    }
  }

  delete(): void {
    const sub = this.dialog.open(
      ConfirmDeleteComponent
    ).afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.deleteMembers();
        }
      })
    this.subscriptions.add(sub);
  }

  private deleteMembers(): void {
    if (this.selection.selected.length > 0 && this.isAdmin) {
      const token = this.combineToken();
      const sub = this.ms.deleteMany(token).subscribe(response => {
        if (response.status === 'OK') {
          this.deletedSuccessfuly();
        }
      })
      this.subscriptions.add(sub);
    }
  }

  private deletedSuccessfuly(): void {
    const members = [];

    this.selection.selected.forEach(member => {
      members.push(member._id);
    })
    this.socket.memberDeleted(members);
    this.selection.clear();
  }

  checkTicketsType(type: number): boolean {
    let state: boolean = false;

    if (this.selection.selected.length === 0) {
      state = true;
    }

    this.selection.selected.forEach(element => {
      if (element.status !== type) {
        state = true;
      }
    });
    return state;
  }

  private combineToken(): string {
    let token: string = '';
    this.selection.selected.forEach(member => {
      token += member._id + '_';
    });

    return token.slice(0, -1);
  }

  private refreshTable(): void {
    this.members = new MatTableDataSource<any>(this.members.data);
    this.members.filter = this.query;
    this.members.paginator = this.paginator;
    this.members.paginator.firstPage();
    this.members.sort = this.sort;
    this.cdr.markForCheck();
  }

}
