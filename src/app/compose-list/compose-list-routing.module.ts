import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComposeListComponent } from './compose-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: <any>ComposeListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: []
})
export class ComposeListRoutingModule {
}