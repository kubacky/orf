import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from 'src/app/login/login-routing.module';
import { CoreModule } from '../core/core.module';

import { LoginComponent } from 'src/app/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
