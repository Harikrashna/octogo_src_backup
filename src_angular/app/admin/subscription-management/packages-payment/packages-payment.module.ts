import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageAddonsCartComponent } from './package-addons-cart/package-addons-cart.component';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppSharedModule } from '@app/shared/app-shared.module';



@NgModule({
  declarations: [PackageAddonsCartComponent],
  imports: [
    CommonModule,UtilsModule,AppSharedModule
  ],
  exports:[PackageAddonsCartComponent]
})
export class PackagesPaymentModule { }
