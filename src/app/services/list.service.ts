import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPCONFIG } from '../shared/globals';
import { Observable } from 'rxjs';

@Injectable()
export class ListService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'list');
  }

  getForUser(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'list/user');
  }

  getList(lId: string): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'list/' + lId);
  }

  markAsRead(lId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'list/read/' + lId, {});
  }

  createList(list: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'list', list);
  }

  updateList(list: any, lId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'list/' + lId, list);
  }

  updateUserList(list: any): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'list/user', list);
  }

  deleteList(lId: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'list/' + lId);
  }

  activateMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'list/many/' + token, {});
  }
  
  deleteMany(token: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'list/many/' + token);
  }
}
