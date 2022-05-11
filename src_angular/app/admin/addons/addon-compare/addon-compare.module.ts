import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddonCompareRoutingModule } from './addon-compare-routing.module';
import { AddonCompareComponent } from './addon-compare/addon-compare.component';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SubheaderModule } from '@app/shared/common/sub-header/subheader.module';
import { PanelModule } from 'primeng/panel';


@NgModule({
  declarations: [
    AddonCompareComponent
  ],
  imports: [
    CommonModule,
    AddonCompareRoutingModule,
    AppSharedModule,
    OverlayPanelModule,
    PanelModule,
    SubheaderModule
  ]
})
export class AddonCompareModule { }
