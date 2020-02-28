import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ListService } from 'src/app/services/list.service';
import { ConfirmDeleteComponent } from 'src/app/shared/components/dialogs/confirm-delete/confirm-delete.component';
import { EditListComponent } from '../dialogs/edit-list/edit-list.component';
import { MemberService } from 'src/app/services/member.service';
import { MemberSocketService } from 'src/app/services/member-socket.service';
import { Functions } from 'src/app/shared/functions';
import { Subscription } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'orf-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnDestroy, AfterViewInit {

  spinner: boolean = true;
  lists: MatTableDataSource<any> = new MatTableDataSource();
  columns: Array<string> = ['select', 'edit', 'active', 'name', 'count'];
  selection: SelectionModel<any> = new SelectionModel<any>(true, []);

  private subscriptions: Subscription = new Subscription();

  private ioConnection: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private socket: MemberSocketService,
    private dialog: MatDialog,
    private ls: ListService,
    private ms: MemberService,
    private f: Functions,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.isModerator()) {
      this.columns = ['edit', 'name', 'count', 'delete'];
    }
    this.getLists();
    this.initSocket();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    this.lists.paginator = this.paginator;
    this.lists.sort = this.sort;
  }

  getLists(): void {
    const sub = this.ls.getAll().subscribe((data) => {
      this.lists.data = data;
      this.spinner = false;
      this.cdr.markForCheck();
    })
    this.subscriptions.add(sub);
  }

  private initSocket(): void {
    this.socket.initSocket();

    const sub1 = this.socket.onListCreated().subscribe((list) => {
      const l = this.parseList(list);
      this.lists.data.push(l);

      this.refreshTable();
    })

    this.subscriptions.add(sub1);

    const sub2 = this.socket.onListUpdated().subscribe((list) => {
      const index = this.f.searchIndex(this.lists.data, '_id', list._id);

      if (index !== false) {
        const l = this.parseList(list);
        this.lists.data[index] = l;
      }
      this.refreshTable();
    })

    this.subscriptions.add(sub2);

    const sub3 = this.socket.onListDeleted().subscribe((lists) => {
      lists.forEach(list => {
        const index = this.f.searchIndex(this.lists.data, '_id', list);
        if (index !== false) {
          this.lists.data.splice(index, 1);
        }
      })
      this.refreshTable();
    })

    this.subscriptions.add(sub3);
  }

  private parseList(list: any): any {
    return {
      _id: list._id,
      owner: list.owner.name,
      ownerId: list.owner.id,
      name: list.owner.company,
      active: list.active,
      members: list.members
    }
  }

  isModerator(): boolean {
    return localStorage.getItem('permissions') === 'moderator';
  }

  isOwner(list: any) {
    if (this.isModerator()) {

      const uId = localStorage.getItem('uId');
      return list.ownerId === uId;
    }
    return true;
  }

  editList(listId: string): void {
    const dialog = this.dialog.open(EditListComponent, {
      data: {
        listId: listId
      }
    });

    const sub = dialog.afterClosed()
      .subscribe((callback) => {
        if (callback) {
          const selected = callback.members;
          this.switchMembers(callback.action, selected);
          this.getLists();
        }
        this.ls.markAsRead(listId).subscribe((response) => {
          //this.socket.memberChanged(response);
        });
      });

    this.subscriptions.add(sub);
  }

  private switchMembers(action: 'accept' | 'reject', members: any): void {
    const token = this.combineToken(members);
    let sub;
    if (action === 'accept') {
      sub = this.ms.activateMany(token).subscribe((response) => { });
    }
    else {
      sub = this.ms.deactivateMany(token).subscribe((response) => { });
    }

    this.subscriptions.add(sub);
  }

  activateMany(): void {
    const token = this.combineToken(this.selection.selected);

    const sub = this.ls.activateMany(token).subscribe((res) => {

      this.selection.clear();
      //this.socket.memberChanged(res);
    })

    this.subscriptions.add(sub);
  }

  deleteMany(): void {
    const sub = this.dialog.open(
      ConfirmDeleteComponent
    ).afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.deleteLists();
        }
      })
    this.subscriptions.add(sub);
  }

  applyFilter(query: string): void {
    query = query.trim();
    query = query.toLowerCase();
    this.lists.filter = query;
  }

  selectRow(member: any, isCheckbox: boolean): void {
    this.selection.toggle(member);
  }

  clearSelection(): void {
    this.selection.clear();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.lists.data.length;
    return numSelected == numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.clearSelection() :
      this.lists.data.forEach(row => this.selectRow(row, true));
  }

  private deleteLists(): void {
    const token = this.combineToken(this.selection.selected);

    const sub = this.ls.deleteMany(token).subscribe((res) => {
      const removed = [];
      this.selection.selected.map(list => removed.push(...list.members));
      const mIds = removed.map(member => member._id);

      const lIds = this.selection.selected.map(list => list._id);

      this.socket.memberDeleted(mIds);
      this.socket.listDeleted(lIds);
      this.sliceSelected();
      this.refreshTable();
      this.selection.clear();
    })
    this.subscriptions.add(sub);
    this.refreshTable();
  }

  private sliceSelected(): void {
    this.selection.selected.forEach((list) => {
      const index = this.f.searchIndex(this.lists.data, '_id', list._id);

      if (index !== false) {
        this.lists.data.splice(index, 1);
      }
    });
  }

  private combineToken(data): string {
    let token: string = '';
    data.forEach((list) => {
      token += list._id + '_';
    });

    return token.slice(0, -1);
  }

  private refreshTable(): void {
    this.lists = new MatTableDataSource<any>(this.lists.data);
    this.cdr.markForCheck();
  }
}
