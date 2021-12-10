import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingTypeComponent } from './pricing-type.component';

const routes: Routes = [{
  path:'',
  component:PricingTypeComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingTypeRoutingModule { }
