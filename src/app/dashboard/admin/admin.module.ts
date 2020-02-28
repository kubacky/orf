import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './components/users/users.component';
import { CoreModule } from '../../core/core.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SettingsComponent } from './components/settings/settings.component';
import { AdminComponent } from './admin.component';
import { UserService } from './services/user.service';
import { ListService } from '../../services/list.service';
import { SettingsService } from './services/settings.service';
import { EditUserComponent } from './components/dialogs/edit-user/edit-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TicketTypesComponent } from './components/ticket-types/ticket-types.component';
import { TicketTypesService } from '../../services/ticket-types.service';
import { EditTicketNameComponent } from './components/dialogs/edit-ticket-name/edit-ticket-name.component';
import { MemberService } from 'src/app/services/member.service';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryComponent } from './components/dialogs/category/category.component';
import { ChartsComponent } from './components/charts/charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SummaryComponent } from './components/summary/summary.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    AdminRoutingModule,
    NgxChartsModule
  ],
  declarations: [
    UsersComponent,
    SettingsComponent,
    AdminComponent,
    EditUserComponent,
    TicketTypesComponent,
    EditTicketNameComponent,
    CategoriesComponent,
    CategoryComponent,
    ChartsComponent,
    SummaryComponent
  ],
  providers: [
    UserService,
    ListService,
    SettingsService,
    TicketTypesService,
    MemberService
  ],
  entryComponents: [
    EditUserComponent,
    EditTicketNameComponent,
    CategoryComponent
  ]
})
export class AdminModule { }
