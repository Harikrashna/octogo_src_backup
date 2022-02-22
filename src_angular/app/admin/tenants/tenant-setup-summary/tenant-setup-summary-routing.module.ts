import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantSetupSummaryComponent } from './tenant-setup-summary/tenant-setup-summary.component';


const routes: Routes = [
  {
    path:'',
    component: TenantSetupSummaryComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantSetupSummaryRoutingModule { }
