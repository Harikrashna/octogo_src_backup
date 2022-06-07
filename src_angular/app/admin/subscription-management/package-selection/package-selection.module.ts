import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageSelectionComponent } from './package-selection/package-selection.component';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { PackagesPaymentModule } from '../packages-payment/packages-payment.module';
import { StepsModule } from 'primeng/steps';
import { TenantRegistrationFormComponent } from './tenant-registration-form/tenant-registration-form.component';
import { PasswordModule } from 'primeng/password';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';





@NgModule({
  declarations: [
    PackageSelectionComponent,TenantRegistrationFormComponent,InvoiceDetailsComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    AppSharedModule,
    PackagesPaymentModule,
    StepsModule,
    PasswordModule
    ],
  exports:[PackageSelectionComponent]
})
export class PackageSelectionModule { }
