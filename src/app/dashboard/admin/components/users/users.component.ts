import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../../services/user.service';
import { EditUserComponent } from '../dialogs/edit-user/edit-user.component';
import { SocketService } from '../../../../services/socket.service';
import { ConfirmDeleteComponent } from '../../../../shared/components/dialogs/confirm-delete/confirm-delete.component';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'orf-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscriptions: Subscription = new Subscription();

  users = new MatTableDataSource();
  columns: string[] = ['select', 'permissions', 'name', 'company', 'active'];
  selection: SelectionModel<Member> = new SelectionModel<Member>(true, []);

  private ioConnection: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private us: UserService,
    private dialog: MatDialog,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.initSocket();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.users.sort = this.sort;
    this.users.paginator = this.paginator;
  }

  private getUsers() {
    const sub = this.us.getAll().subscribe(
      (data) => {
        this.users.data = data;
      }
    )
    this.subscriptions.add(sub);
  }

  private initSocket() {
    this.socket.initSocket();

    this.ioConnection = this.socket.onUserChanges()
      .subscribe((data) => {
        this.getUsers();
      });
  }

  addUser(): void {
    this.editUser(false);
  }

  editUser(user: any): void {
    const dialog = this.dialog.open(EditUserComponent, {
      data: user
    });

    const sub = dialog.afterClosed()
      .subscribe((changes) => {
        if (changes) {
          this.socket.userChanged({ changes });
          this.getUsers();
        }
      })
    this.subscriptions.add(sub);    
  }

  activateMany(): void {
    const token = this.combineToken();

    const sub = this.us.activateMany(token).subscribe((res) => {

      this.selection.clear();
      this.socket.userChanged(res);
    })
    this.subscriptions.add(sub);    
  }

  deleteMany(): void {
    const sub = this.dialog.open(
      ConfirmDeleteComponent
    ).afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.deleteUsers();
        }
      })
    this.subscriptions.add(sub);
  }

  applyFilter(query: string) {
    query = query.trim();
    query = query.toLowerCase();
    this.users.filter = query;
  }

  selectRow(member: any, isCheckbox: boolean): void {
    this.selection.toggle(member);
  }

  clearSelection() {
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.users.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.clearSelection() :
      this.users.data.forEach(row => this.selectRow(row, true));
  }

  private deleteUsers() {
    const token = this.combineToken();

    const sub = this.us.deleteMany(token).subscribe((res) => {
      this.selection.clear();
      this.socket.userChanged(res);
    })
    this.subscriptions.add(sub);
  }

  private combineToken(): string {
    let token: string = '';
    this.selection.selected.forEach((user) => {
      token += user._id + '_';
    });

    return token.slice(0, -1);
  }
}
