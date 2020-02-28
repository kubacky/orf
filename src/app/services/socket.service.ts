import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Observable, Observer } from 'rxjs';
import { APPCONFIG } from '../shared/globals';

@Injectable()
export class SocketService {

  constructor() { }

  private socket;

  public initSocket(): void {
    this.socket = socketIo(APPCONFIG.APP_URL);
  }

  userChanged(user: any): void {
    this.socket.emit('userChanged', user);
  }

  onUserChanges(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('userChanged', (data: any) => {
        return observer.next(data);
      });
    })
  }

  memberChanged(member: any): void {
    this.socket.emit('memberChanged', member);
  }

  onMemberChanges(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('memberChanged', (data: any) => {
        return observer.next(data);
      });
    })
  }

  ticketTypeChanged(ticketType: any): void {
    this.socket.emit('ticketTypeChanged', ticketType);
  }

  onTicketTypeChanges(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('ticketTypeChanged', (data: any) => {
        return observer.next(data);
      });
    })
  }
}
