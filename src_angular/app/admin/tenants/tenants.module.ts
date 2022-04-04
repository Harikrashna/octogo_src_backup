import {NgModule} from '@angular/core';
import {AdminSharedModule} from '@app/admin/shared/admin-shared.module';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {TenantsRoutingModule} from './tenants-routing.module';
import {CreateTenantModalComponent} from './create-tenant-modal.component';
import {EditTenantModalComponent} from './edit-tenant-modal.component';
import {TenantFeaturesModalComponent} from './tenant-features-modal.component';
import {TenantsComponent} from './tenants.component';
import { TenantSubscriptionDetailsComponent } from './tenant-subscription-details/tenant-subscription-details.component';
import { CreateEditTenantModule } from './create-edit-tenant-new/create-edit-tenant.module';


@NgModule({
    declarations: [CreateTenantModalComponent, EditTenantModalComponent, 
        TenantFeaturesModalComponent, TenantsComponent, TenantSubscriptionDetailsComponent],
    imports: [AppSharedModule, AdminSharedModule, TenantsRoutingModule, CreateEditTenantModule]
})
export class TenantsModule {
}
