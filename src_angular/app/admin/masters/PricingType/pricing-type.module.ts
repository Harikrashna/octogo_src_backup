import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingTypeRoutingModule } from './pricing-type-routing.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { PricingTypeComponent } from './pricing-type.component';
import { CreateOrEditPricingTypeModalComponent } from './create-or-edit-pricing-modal/create-or-edit-pricing-type-modal.component';



@NgModule({
  declarations: [
    PricingTypeComponent,
    CreateOrEditPricingTypeModalComponent
  ],
  imports: [
    CommonModule,
    PricingTypeRoutingModule,
    AppSharedModule,
    AdminSharedModule
  ]
})
export class PricingTypeModule { }
