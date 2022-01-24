import { NgModule } from '@angular/core';


import { EditionSelectionComparisonRoutingModule } from './edition-selection-comparison-routing.module';
import { EditionSelectionComparisonComponent } from './edition-selection-comparison/edition-selection-comparison.component';
import { AccountSharedModule } from '@account/shared/account-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import {SelectButtonModule} from 'primeng/selectbutton';
import { SelectEditionModule } from '@account/register/select-edition.module';
// import { UniquePipe } from './unique.pipe';
// import { PairPipe } from './edition-selection-comparison/pair.pipe';



@NgModule({
  declarations: [
    EditionSelectionComparisonComponent,
    // UniquePipe,
    // PairPipe
  ],
  imports: [
    EditionSelectionComparisonRoutingModule,
    AccountSharedModule,
    AppSharedModule,
    OverlayPanelModule,
    PanelModule,
    SelectButtonModule,
    SelectEditionModule
  ]
})
export class EditionSelectionComparisonModule { }
