import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPCONFIG } from '../shared/globals';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'member');
  }

  getForUser(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'member/user');
  }

  getMember(tId: string): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'member/' + tId);
  }

  getSummary(): Observable<any> {
    return this.http.get(APPCONFIG.API_URL + 'member/summary');
  }

  find(query: string): Observable<any> {
    const q = { query: query };
    return this.http.put(APPCONFIG.API_URL + 'member/find/', query);
  }

  createMember(member: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'member', member);
  }

  updateMember(member: any, tId: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/' + tId, member);
  }

  updateUserMember(member: any): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/user', member);
  }

  deleteMember(lId: string): Observable<any> {
    return this.http.delete<any>(APPCONFIG.API_URL + 'member/' + lId);
  }

  activateMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/many', { token: token });
  }

  issuingMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/issuing', { token: token });
  }

  returnMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/return', { token: token });
  }

  deactivateMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/deactivate', { token: token });
  }

  deleteMany(token: string): Observable<any> {
    return this.http.put<any>(APPCONFIG.API_URL + 'member/many/delete', { token: token });
  }
}
