import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';
import { CreateOrEditServicesComponent } from './create-or-edit-services/create-or-edit-services.component';


@NgModule({
  declarations: [
    ServicesComponent,
    CreateOrEditServicesComponent

  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,

    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
  ]
})
export class ServicesModule { }
