import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CategoriesService } from 'src/app/services/categories.service';
import { Functions } from 'src/app/shared/functions';

@Component({
  selector: 'orf-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  userForm: FormGroup;
  categories: any[];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<EditUserComponent>,
    private fb: FormBuilder,
    private cs: CategoriesService,
    private us: UserService,
    private f: Functions,
    private ns: NotificationsService,
    @Inject(MAT_DIALOG_DATA) private user: any
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      company: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      limit: [0, Validators.required],
      permissions: ['', Validators.required],
      canManage: this.buildAssociationForm(),
      password: '',
      confirmPassword: '',
      agreement: true,
      active: true
    });

    if (!this.user) {
      this.userForm.get('password').setValidators([Validators.required, Validators.minLength(3)]);
      this.userForm.get('confirmPassword').setValidators([Validators.required, Validators.minLength(3)]);
    }
  }

  private init(): void {
    const sub = this.cs.getAll().subscribe((categories) => {
      this.categories = categories;
      this.buildForm();

      if (this.user) {
        this.getUser();
      }
      else {
        this.trackTypeChanges();
      }
    })
    this.subscriptions.add(sub);
  }

  private getUser(): void {
    const sub = this.us.getUser(this.user._id).subscribe(
      (data) => {
        this.userForm.get('company').setValue(data.company);
        this.userForm.get('name').setValue(data.name);
        this.userForm.get('email').setValue(data.email);
        this.userForm.get('type').setValue(data.type);
        this.userForm.get('limit').setValue(data.limit);
        this.userForm.get('agreement').setValue(data.agreement);
        this.userForm.get('active').setValue(data.active);
        this.userForm.get('permissions').setValue(data.permissions);
        this.checkPermissions(data.canManage);
        this.trackTypeChanges();
      }
    )
    this.subscriptions.add(sub);
  }

  private checkPermissions(permissions): void {
    this.categories.forEach((cat) => {
      const index = this.f.searchIndex(permissions, '_id', cat._id);
      this.userForm.get('canManage').get(cat._id).setValue((index !== false) ? true : false);
    });
  }

  private buildAssociationForm(): FormGroup {
    const assoc = this.fb.group({});

    this.categories.forEach((cat) => {
      const nc = this.fb.control(false);
      assoc.setControl(cat._id, nc);
    })
    return assoc;
  }

  trackTypeChanges(): void {
    this.userForm.get('permissions').valueChanges.forEach(
      (value: string) => {
        if (value === 'user') {
          this.userForm.get('type').setValue('');
          this.userForm.get('company').setValue('');
          this.userForm.get('limit').setValue(0);
        }
        else {
          this.userForm.get('limit').setValue(0);
          this.userForm.get('type').setValue('operator');
          this.userForm.get('company').setValue('Obsługa festiwalu');
        }
      }
    );
  }


  isEdited(): boolean {

    // this.user encapsulation
    if (this.user) {
      return true;
    }
    return false;
  }

  saveUser(): void {
    const user = this.userForm.value;

    if (this.user) {
      this.updateUser(user);
    }
    else {
      this.createUser(user);
    }
  }

  private createUser(user: any): void {
    const sub = this.us.createUser(user).subscribe(
      (response) => {
        if (response.status === 'OK') {
          this.success(response)
        }
        else {
          this.ns.error(response.message);
        }
      });

    this.subscriptions.add(sub);
  }

  private updateUser(user: any): void {
    const sub = this.us.updateUser(user, this.user._id).subscribe(
      (response) => {
        if (response.status === 'OK') {
          this.success(response)
        }
        else {
          this.ns.error(response.message);
        }
      })

    this.subscriptions.add(sub);
  }

  private success(response: any): void {
    this.ns.success('Zaktualizowano dane');
    this.dialogRef.close(true);
  }

  private error(response: any): void {
    this.ns.error(response.message);
  }
}
