import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeratorComponent } from './moderator.component';
import { ListsComponent } from 'src/app/dashboard/moderator/components/lists/lists.component';
import { ListComponent } from 'src/app/dashboard/moderator/components/list/list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ModeratorComponent,
    children: [
      {
        path: 'lists',
        component: ListsComponent
      },
      {
        path: 'list/create',
        component: ListComponent
      },
      {
        path: 'list/edit/:id',
        component: ListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: []
})
export class ModeratorRoutingModule { }
