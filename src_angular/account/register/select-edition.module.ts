import {NgModule} from '@angular/core';
import {AppSharedModule} from '@app/shared/app-shared.module';
import {SelectEditionRoutingModule} from './select-edition-routing.module';
import {AccountSharedModule} from '@account/shared/account-shared.module';
import {SelectEditionComponent} from './select-edition.component';
import {PanelModule} from 'primeng/panel';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {DividerModule} from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    declarations: [SelectEditionComponent],
    imports: [AppSharedModule, AccountSharedModule, SelectEditionRoutingModule,
        PanelModule,
        OverlayPanelModule,
        DividerModule,
        TooltipModule],
        exports: [SelectEditionComponent]
})
export class SelectEditionModule {
}
