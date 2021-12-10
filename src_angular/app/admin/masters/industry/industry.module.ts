import { IndustryComponent } from './industry.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustryRoutingModule } from './industry-routing.module';
import { CreateOrEditIndustryComponent } from './create-or-edit-industry/create-or-edit-industry.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';


@NgModule({
  declarations: [
    IndustryComponent,
    CreateOrEditIndustryComponent
  ],
  imports: [
    CommonModule,
    IndustryRoutingModule,
    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
  ]
})
export class IndustryModule { }
