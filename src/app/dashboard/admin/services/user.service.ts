import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPCONFIG } from '../../../shared/globals';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'user');
  }

  getUser(uId: string): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'user/' + uId);
  }

  getCurrent(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'user/current');
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'user', user);
  }

  updateUser(user: any, uId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'user/' + uId, user);
  }

  updateCurrent(user: any): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'user/current', user);
  }

  deleteUser(uId: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'user/' + uId);
  }

  activateMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'user/many/' + token, {});
  }

  deleteMany(token: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'user/many/' + token);
  }
}
