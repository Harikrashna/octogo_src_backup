import { CreateOrEditAirlineComponent } from './create-or-edit-airline/create-or-edit-airline.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AirlineRoutingModule } from './airline-routing.module';
import { AirlineComponent } from './airline.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';


@NgModule({
  declarations: [CreateOrEditAirlineComponent,AirlineComponent],
  imports: [
    CommonModule,
    AirlineRoutingModule,
    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule
  ]
})
export class AirlineModule { }
