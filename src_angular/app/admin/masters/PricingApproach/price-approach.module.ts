import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceApproachComponent } from './price-approach.component';
import {AdminSharedModule} from '@app/admin/shared/admin-shared.module';
import {AppSharedModule} from '@app/shared/app-shared.module';
import { CreateOrEditPricingApproachModalComponent } from './create-or-edit-pricing-approach-modal/create-or-edit-pricing-approach-modal.component';
import { PriceApproachRoutingModule } from './price-approach-routing.module';



@NgModule({
  declarations: [PriceApproachComponent,CreateOrEditPricingApproachModalComponent],
  imports: [AdminSharedModule, AppSharedModule,PriceApproachRoutingModule]
})
export class PriceApproachModule {

 }
