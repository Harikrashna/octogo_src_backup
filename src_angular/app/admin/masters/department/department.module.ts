import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { CreateOrEditDepartmentComponent } from './create-or-edit-department/create-or-edit-department.component';
import { DepartmentComponent } from './department.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';


@NgModule({
  declarations: [
    DepartmentComponent,
    CreateOrEditDepartmentComponent,
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    AppSharedModule,
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,
  ]
})
export class DepartmentModule { }
