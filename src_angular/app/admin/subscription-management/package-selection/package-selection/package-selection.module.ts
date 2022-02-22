import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageSelectionComponent } from './package-selection.component';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { PackagesPaymentModule } from '../../packages-payment/packages-payment.module';



@NgModule({
  declarations: [
    PackageSelectionComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    AppSharedModule,
    PackagesPaymentModule
  ],
  exports:[PackageSelectionComponent]
})
export class PackageSelectionModule { }
