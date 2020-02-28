import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { TYPES } from '../shared/globals';

@Component({
  selector: 'orf-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userTypes: any[];

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private rs: RegisterService,
    private ns: NotificationsService,
    private socket: SocketService,
    private router: Router
  ) {
    this.userTypes = TYPES;
    this.socket.initSocket();
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.registerForm = this.fb.group({
      company: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
      agreement: false
    })
  }

  isFormComplete(): boolean {
    const form = this.registerForm.value;

    if (this.registerForm.valid && form.agreement) {
      return form.password === form.confirmPassword
    }

    return false;
  }

  register() {
    let userModel = this.registerForm.value;

    this.rs.createUser(userModel)
      .subscribe((response) => {
        if (response.status === 'ERROR') {
          this.ns.error(response.title, response.message)
        }
        else {
          this.socket.userChanged(response);
          this.router.navigate(['/thanks']);
        }
      });
  }
}
