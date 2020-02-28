import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPCONFIG } from '../shared/globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private http: HttpClient
  ) { }

  createUser(newUser: any): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'register', newUser);
  }
}
