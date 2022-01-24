import { CityComponent } from './city.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';
import { FormsModule } from '@angular/forms';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { CreateOrEditCityComponent } from './create-or-edit-city/create-or-edit-city.component';


@NgModule({
  declarations: [CityComponent,CreateOrEditCityComponent],
  imports: [
    CommonModule,
    CityRoutingModule,    
    AppSharedModule, 
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
    FormsModule
  ]
})
export class CityModule { }
