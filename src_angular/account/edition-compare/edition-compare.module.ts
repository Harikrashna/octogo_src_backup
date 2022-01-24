import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountSharedModule } from '@account/shared/account-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import {OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { EditionCompareRoutingModule } from './edition-compare-routing.module';
import { EditionCompareComponent } from './edition-compare/edition-compare.component';




@NgModule({
  declarations: [EditionCompareComponent],
  imports: [
    EditionCompareRoutingModule,
    AccountSharedModule,
    AppSharedModule,
    OverlayPanelModule,
    PanelModule
    
  ]
})
export class EditionCompareModule { }
