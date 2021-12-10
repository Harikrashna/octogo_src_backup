import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsertypeComponent } from './usertype.component';

const routes: Routes = [
  {
    path: '',
    component: UsertypeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsertypeRoutingModule { }
