
import { ProductComponent } from './product.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { DynamicEntityPropertyManagerModule } from '@app/shared/common/dynamic-entity-property-manager/dynamic-entity-property-manager.module';
import { CreateOrEditProductComponent } from './create-or-edit-product/create-or-edit-product.component';




@NgModule({
  declarations: [
    ProductComponent,
    CreateOrEditProductComponent    
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    AppSharedModule, 
    AdminSharedModule,
    DynamicEntityPropertyManagerModule,

  ]
})
export class ProductModule { }
