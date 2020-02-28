import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListsComponent } from './components/lists/lists.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModeratorRoutingModule } from './moderator-routing.module';
import { ModeratorComponent } from './moderator.component';
import { ListComponent } from './components/list/list.component';
import { EditListComponent } from './components/dialogs/edit-list/edit-list.component';
import { ListService } from 'src/app/services/list.service';
import { TicketTypesService } from 'src/app/services/ticket-types.service';
import { MemberService } from 'src/app/services/member.service';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    ModeratorRoutingModule
  ],
  declarations: [
    ModeratorComponent,
    ListsComponent,
    ListComponent,
    EditListComponent
  ],
  providers: [
    ListService,
    TicketTypesService,
    MemberService
  ],
  entryComponents: [
    EditListComponent
  ]
})
export class ModeratorModule { }
