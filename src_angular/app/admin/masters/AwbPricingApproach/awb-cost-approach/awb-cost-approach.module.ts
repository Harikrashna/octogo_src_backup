import { CreateOrEditAwbCostApproachComponent } from './../create-or-edit-awb-cost-approach/create-or-edit-awb-cost-approach.component';

import { AwbCostApproachComponent } from './awb-cost-approach.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';
import { AwbCostApproachRoutingModule } from '../awb-cost-approach-routing.module';


@NgModule({
  declarations: [AwbCostApproachComponent,CreateOrEditAwbCostApproachComponent],
  imports: [
    CommonModule,
    AwbCostApproachRoutingModule,
    AppSharedModule, 
    AdminSharedModule,
    DynamicEntityPropertyManagerModule
  ]
})
export class AwbCostApproachModule { }
