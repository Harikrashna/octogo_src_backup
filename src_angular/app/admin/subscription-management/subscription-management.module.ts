import {NgModule} from '@angular/core';
import {AdminSharedModule} from '@app/admin/shared/admin-shared.module';
import {AppSharedModule} from '@app/shared/app-shared.module';
import { SharedPackageDetailsComponent } from './shared-package-details/shared-package-details.component';
import { SubscribedProductsDetailsComponent } from './subscribed-products-details/subscribed-products-details.component';
import {SubscriptionManagementRoutingModule} from './subscription-management-routing.module';
import {SubscriptionManagementComponent} from './subscription-management.component';
import { TenantProductSetupSummaryComponent } from './tenant-product-setup-summary/tenant-product-setup-summary.component';
import { PackageDetailedInformationComponent } from './package-detailed-information/package-detailed-information.component';
import { PackageSelectionModule } from './package-selection/package-selection.module';
import { SubscriptionPaymentHistoryComponent } from './subscription-payment-history/subscription-payment-history.component';




@NgModule({
    declarations: [SubscriptionManagementComponent,SharedPackageDetailsComponent,
         TenantProductSetupSummaryComponent,SubscribedProductsDetailsComponent, 
         PackageDetailedInformationComponent, SubscriptionPaymentHistoryComponent],
    imports: [
        AppSharedModule,
        AdminSharedModule,
        SubscriptionManagementRoutingModule,
        PackageSelectionModule],
    exports: [SharedPackageDetailsComponent, SubscribedProductsDetailsComponent]
})
export class SubscriptionManagementModule {
}
