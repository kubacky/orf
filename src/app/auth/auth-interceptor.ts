import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AlertsService } from '@jaspero/ng-alerts';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private ns: NotificationsService
  ) {

  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'token ' + idToken)
      });

      return next.handle(cloned).pipe(
        tap((event: HttpEvent<any>) => {},
          (err: any) => {
            this.handleError(err);
          })
      );
    }
    else {
      return next.handle(req);
    }
  }

  private handleError(err: any) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) { 
        this.router.navigate(['/login']);
      }
      else {
        this.ns.error('Błąd', 'Zadzwoń do Artura');
      }
    }
  }

}
