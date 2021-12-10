import { CreateOrUpdateUserInput } from './../../../../shared/service-proxies/service-proxies';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsertypeRoutingModule } from './usertype-routing.module';
import { UsertypeComponent } from './usertype.component';
import { CreateOrEditUsertypeComponent } from './create-or-edit-usertype/create-or-edit-usertype.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';


@NgModule({
  declarations: [
  UsertypeComponent,
  CreateOrEditUsertypeComponent,
  ],
  imports: [
    CommonModule,
    UsertypeRoutingModule,
    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
  ]
})
export class UsertypeModule { }
