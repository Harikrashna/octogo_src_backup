
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwbCostApproachComponent } from './awb-cost-approach/awb-cost-approach.component';

const routes: Routes = [
  {
    path: '',
      component: AwbCostApproachComponent,
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AwbCostApproachRoutingModule { }
