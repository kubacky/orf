import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SocketService } from 'src/app/services/socket.service';
import { EditProfileComponent } from 'src/app/shared/components/dialogs/edit-profile/edit-profile.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'orf-profile-button',
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements OnInit {

  @Input('full-height') fullHeight: boolean;
  username: String;

  constructor(
    private socket: SocketService,
    private dialog: MatDialog,
    private as: AuthService
  ) { }

  ngOnInit() {
    this.getUsername();
    this.initSocket();
  }
  private initSocket(): void {
    this.socket.initSocket();

    this.socket.onUserChanges().subscribe((data) => {
      this.getUsername();
    });
  }

  getUsername(): void {
    this.username = localStorage.getItem('username');
  }

  editProfile(): void {
    const dialog = this.dialog.open(EditProfileComponent, {
    });

    dialog.afterClosed()
      .subscribe((changes) => {
        if (changes) {
          this.socket.userChanged({ changes });
        }
      });
  }

  logout(): void {
    this.as.logout();
  }
}
