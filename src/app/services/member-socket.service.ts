import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable, Observer } from 'rxjs';
import { APPCONFIG } from '../shared/globals';

@Injectable()
export class MemberSocketService {

  constructor() { }

  private socket;

  public initSocket(): void {
    this.socket = socketIo(APPCONFIG.APP_URL);
  }

  memberStatusChanged(member: any) {
    this.socket.emit('memberStatusChanged', member)
  }

  onMemberStatusChanges(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('memberStatusChanged', (member: any) => {
        return observer.next(member);
      });
    })
  }

  newListCreated(list: any) {
    this.socket.emit('newListCreated', list)
  }

  onListCreated(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('newListCreated', (list: any) => {
        return observer.next(list);
      });
    })
  }

  listUpdated(list: any) {
    this.socket.emit('listUpdated', list)
  }

  onListUpdated(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('listUpdated', (list: any) => {
        return observer.next(list);
      });
    })
  }

  listDeleted(list: any) {
    this.socket.emit('listDeleted', list)
  }

  onListDeleted(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('listDeleted', (list: any) => {
        return observer.next(list);
      });
    })
  }


  memberDeleted(members: any): void {
    this.socket.emit('memberDeleted', members);
  }

  onMemberDeleted(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('memberDeleted', (members: any) => {
        return observer.next(members);
      });
    })
  }

  onMemberChanges(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('memberChanged', (data: any) => {
        return observer.next(data);
      });
    })
  }
}
