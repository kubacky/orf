import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'orf-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  private isUserAdmin: boolean = false;
  private isUserModerator: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
    const permissions = localStorage.getItem('permissions');
    
    if (permissions === 'moderator') {
      this.isUserModerator = true;
    }
      
    if (permissions === 'admin') {
      this.isUserAdmin = true;
      this.isUserModerator = true;
    }
  }

  isAdmin(): boolean {
    return this.isUserAdmin;
  }

  isModerator(): boolean {
    return this.isUserModerator;
  }

  toggle($event) {
    $event.currentTarget.classList.toggle('open');
  }

}
