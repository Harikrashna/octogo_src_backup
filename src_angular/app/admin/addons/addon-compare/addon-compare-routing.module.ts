import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddonCompareComponent } from './addon-compare/addon-compare.component';

const routes: Routes = [
  {
    path:'',
    component: AddonCompareComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddonCompareRoutingModule { }
