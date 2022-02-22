import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountSharedModule } from '@account/shared/account-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import {OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';

import { TenantSetupSummaryRoutingModule } from './tenant-setup-summary-routing.module';

import { SubheaderModule } from '@app/shared/common/sub-header/subheader.module';
import { TenantSetupSummaryComponent } from './tenant-setup-summary/tenant-setup-summary.component';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';


@NgModule({
  declarations: [TenantSetupSummaryComponent],
  imports: [
    TenantSetupSummaryRoutingModule,
    AccountSharedModule,
    AppSharedModule,
    OverlayPanelModule,
    PanelModule,
    SubheaderModule,
    AdminSharedModule
    
  ]
})
export class TenantSetupSummaryModule { }
