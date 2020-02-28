import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../core/services/layout.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APPCONFIG } from '../shared/globals';
import * as moment from "moment";
import { tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(credentials): Observable<any> {
    return this.http.post<any>(APPCONFIG.API_URL + 'auth', credentials)
      .pipe(tap((res) => this.setSession(res)), shareReplay());
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    this.clearLocalStorage();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  } 

  clearLocalStorage() {
    //for sure
    localStorage.removeItem('id_token');
    localStorage.removeItem("expires_at");
    
    localStorage.clear();
  }
}
