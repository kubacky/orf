import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class ModeratorGuard implements CanLoad {

  constructor(
    private router: Router
  ) {

  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    
    const token = localStorage.getItem('id_token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const decode = jwt_decode(token);

    if (decode.permissions === 'admin' || decode.permissions === 'moderator') {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
