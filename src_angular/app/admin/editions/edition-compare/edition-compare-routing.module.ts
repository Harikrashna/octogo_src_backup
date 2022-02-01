import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionCompareComponent } from './edition-compare/edition-compare.component';

const routes: Routes = [
  {
    path:'',
    component: EditionCompareComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditionCompareRoutingModule { }
