import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPCONFIG } from '../shared/globals';
import { Observable } from 'rxjs';

@Injectable()
export class TicketTypesService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'ticket-type');
  }

  getForUser(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'ticket-type/user');
  }

  getTicketType(tId: string): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'ticket-type/' + tId);
  }

  createTicketType(ticketType: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'ticket-type', ticketType);
  }

  updateTicketType(ticketType: any, tId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'ticket-type/' + tId, ticketType);
  }

  deleteTicketType(tId: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'ticket-type/' + tId);
  }

  updateTicketField(ticketType: any, tId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'ticket-type/value/' + tId, ticketType);
  }
}
