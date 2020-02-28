import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { ListService } from 'src/app/services/list.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'orf-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  list: any;
  members = new MatTableDataSource();
  columns: string[] = ['select', 'name', 'role', 'ticket', 'status'];
  selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  private ioConnection: any;

  constructor(
    private dialogRef: MatDialogRef<EditListComponent>,
    private ns: NotificationsService,
    private ls: ListService,
    private fb: FormBuilder,
    private socket: SocketService,
    @Inject(MAT_DIALOG_DATA) private listData: any
  ) { }

  ngOnInit() {
    if (this.isModerator()) {
      this.columns = ['name', 'role', 'ticket', 'status'];
    }

    this.getList();
    this.initSocket();
  }

  isModerator(): boolean {
    return localStorage.getItem('permissions') === 'moderator'
  }

  private initSocket() {
    this.socket.initSocket();

    this.ioConnection = this.socket.onMemberChanges()
      .subscribe((data) => {
        this.getList();
      });
  }

  getList(): void {
    this.ls.getList(this.listData.listId).subscribe((data) => {
      this.list = data;
      this.members.data = data.members;
    })
  }

  selectRow(member: any, isCheckbox: boolean): void {
    if (member.status !== 2) {
      this.selection.toggle(member);
    }
  }

  clearSelection() {
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.members.data.length;
    return numSelected == numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.clearSelection() :
      this.members.data.forEach(row => this.selectRow(row, true));
  }
}
