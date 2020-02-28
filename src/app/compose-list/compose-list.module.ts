import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposeListComponent } from './compose-list.component';
import { ComposeListRoutingModule } from 'src/app/compose-list/compose-list-routing.module';
import { CoreModule } from '../core/core.module';
import { TicketTypesService } from 'src/app/services/ticket-types.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListService } from 'src/app/services/list.service';

@NgModule({
  imports: [
    CommonModule,
    ComposeListRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [
    ComposeListComponent
  ],
  providers: [
    TicketTypesService,
    ListService
  ]
})
export class ComposeListModule { }
