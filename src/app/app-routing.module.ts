import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ThanksComponent } from './register/thanks/thanks.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { ModeratorGuard } from 'src/app/auth/moderator.guard';
import { OperatorGuard } from 'src/app/auth/operator.guard';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'compose-list',
    canLoad: [AuthGuard],
    loadChildren: './compose-list/compose-list.module#ComposeListModule',
  },
  {
    path: 'dashboard',
    canLoad: [OperatorGuard, AuthGuard],
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'thanks',
    component: <any>ThanksComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}