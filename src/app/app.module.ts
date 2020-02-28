import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { RegisterComponent } from './register/register.component';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { ThanksComponent } from './register/thanks/thanks.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SocketService } from './services/socket.service';
import { MemberSocketService } from 'src/app/services/member-socket.service';
import { Functions } from 'src/app/shared/functions';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ThanksComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    SocketService,
    MemberSocketService,
    Functions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
