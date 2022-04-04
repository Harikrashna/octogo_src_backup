import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantDetailsComponent } from './tenant-details/tenant-details.component';
import { TransactionalChargesComponent } from './transactional-charges/transactional-charges.component';
import { CreateEditTenantNewComponent } from './create-edit-tenant-new.component';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { PackagesDetailComponent } from './packages-detail/packages-detail.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { EditionsModule } from '@app/admin/editions/editions.module';



@NgModule({
  declarations: [CreateEditTenantNewComponent, TransactionalChargesComponent,
     TenantDetailsComponent,PaymentDetailsComponent, PackagesDetailComponent],
  imports: [CommonModule, AppSharedModule, AdminSharedModule, EditionsModule],
  exports:[CreateEditTenantNewComponent]
})
export class CreateEditTenantModule { }
