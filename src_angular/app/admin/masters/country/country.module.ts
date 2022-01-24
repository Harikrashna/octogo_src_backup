import { CountryComponent } from './country.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryRoutingModule } from './country-routing.module';
import { CreateOrEditCountryComponent } from './create-or-edit-country/create-or-edit-country.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';


@NgModule({
  declarations: [
    CountryComponent,
    CreateOrEditCountryComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
  ]
})
export class CountryModule { }
