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
import { SpinnerService } from 'src/app/services/spinner.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private spiner: SpinnerService
  ) {

  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.spiner.startSpinner();

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.spiner.stopSpinner();
        }
      },
        (err: any) => {
          
        })
    );
  }
}
