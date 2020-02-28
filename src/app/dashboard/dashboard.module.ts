import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from 'src/app/dashboard/dashboard-routing.module';
import { CoreModule } from '../core/core.module';

//components
import { TicketsComponent } from './components/tickets/tickets.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileButtonComponent } from 'src/app/shared/components/profile-button/profile-button.component';
import { MemberService } from 'src/app/services/member.service';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    TicketsComponent,
    SidebarComponent,
    NavigationComponent,
    ToolbarComponent
  ],
  exports: [
    ProfileButtonComponent
  ],
  providers: [
    MemberService
  ]
})
export class DashboardModule { }
