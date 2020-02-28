import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { AdminGuard } from '../auth/admin.guard';
import { ModeratorGuard } from '../auth/moderator.guard';
import { AuthGuard } from '../auth/auth.guard';

const ROUTES: Routes = [
  {
    path: '',
    component: <any>DashboardComponent,
    children: [
      {
        path: '',
        component: TicketsComponent
      },
      {
        path: 'moderator',
        canLoad: [ModeratorGuard, AuthGuard],
        loadChildren: './moderator/moderator.module#ModeratorModule'
      },
      {
        path: 'admin',
        canLoad: [AdminGuard, AuthGuard],
        loadChildren: './admin/admin.module#AdminModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule {
}