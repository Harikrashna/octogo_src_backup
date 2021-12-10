import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminSharedModule} from '@app/admin/shared/admin-shared.module';
import {AppSharedModule} from '@app/shared/app-shared.module';
import { DesignationComponent } from './designation.component';
import { DesignationRoutingModule } from './designation-routing.module';
import { CreateOrUpdateDesignationComponent } from './create-or-update-designation/create-or-update-designation.component';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';



@NgModule({
  declarations: [DesignationComponent,CreateOrUpdateDesignationComponent],
  imports: [
    CommonModule,
    DesignationRoutingModule,
    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
  ]
})
export class DesignationModule {

 }
