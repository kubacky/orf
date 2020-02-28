import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';
import { UserService } from 'src/app/dashboard/admin/services/user.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'orf-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  userForm: FormGroup
  private sub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<EditProfileComponent>,
    private fb: FormBuilder,
    private us: UserService,
    private ns: NotificationsService,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.getUser();
    this.socket.initSocket();
  }

  private getUser(): void {
    this.sub = this.us.getCurrent().subscribe(
      (response) => {
        this.buildForm(response);
      }
    );
  }

  buildForm(data: any): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: '',
      confirmPassword: ''
    });

    this.userForm.get('name').setValue(data.name);
    this.userForm.get('email').setValue(data.email);
  }

  saveUser(): void {
    const user = this.userForm.value;

    this.us.updateCurrent(user).subscribe(
      (response) => {
        if (response.status === 'OK') {
          this.success(response)
        }
        else {
          this.ns.error(response.message);
        }
      });
  }

  private success(response: any): void {
    this.ns.success(response.message.pl, response.message.en);

    const username = this.userForm.get('name').value;
    localStorage.setItem('username', username);

    this.sub.unsubscribe();
    this.dialogRef.close(true);
  }

  private error(response: any): void {
    this.ns.error(response.message);
  }
}
