import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteComponent } from './components/dialogs/confirm-delete/confirm-delete.component';
import { CoreModule } from '../core/core.module';
import { EditProfileComponent } from './components/dialogs/edit-profile/edit-profile.component';
import { ProfileButtonComponent } from './components/profile-button/profile-button.component';
import { UserService } from 'src/app/dashboard/admin/services/user.service';
import { MembersListComponent } from 'src/app/compose-list/components/members-list/members-list.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [ConfirmDeleteComponent, EditProfileComponent, ProfileButtonComponent, MembersListComponent],
  exports: [ProfileButtonComponent, MembersListComponent],
  entryComponents: [
    ConfirmDeleteComponent,
    EditProfileComponent
  ],
  providers: [
    UserService
  ]
})
export class SharedModule { }
