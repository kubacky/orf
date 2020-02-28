import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as jwt_decode from "jwt-decode";
import { AuthService } from '../auth/auth.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'orf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private ns: NotificationsService,
    private as: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.as.clearLocalStorage();

    this.buildLoginForm();
  }

  buildLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      remember: true
    })
  }

  login(): void {
    const credentials = this.loginForm.value;

    this.as.login(credentials).subscribe(
      (response) => {
        if (response.status === 'ERROR') {
          this.ns.error(response.title, response.message)
        }
        else {
          this.loginSuccess(response);
        }
      }
    )
  }

  private loginSuccess(response: any): void {
    const decode = jwt_decode(response.token);
    const permissions = decode.permissions;
    
    localStorage.setItem('uId', decode.sub),
    localStorage.setItem('user', decode.name);
    localStorage.setItem('username', decode.name);
    localStorage.setItem('permissions', permissions);
    localStorage.setItem('limit', decode.limit);

    if (permissions === 'user') {
      this.router.navigate(['/compose-list']);
    }
    else {
      this.router.navigate(['/dashboard']);
    }
  }

  private loginFailed(): void {
    this.ns.error('Spróbuj ponownie', 'Nieprawidłowy login lub hasło')
  }
}
