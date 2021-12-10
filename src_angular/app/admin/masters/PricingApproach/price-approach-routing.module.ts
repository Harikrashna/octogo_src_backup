import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceApproachComponent } from './price-approach.component';

const routes: Routes = [{
  path: '',
  component: PriceApproachComponent,
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceApproachRoutingModule { }
