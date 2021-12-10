import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AddonslistComponent } from './addonslist/addonslist.component';
import { InsertUpdateAddonsComponent } from './insert-update-addons/insert-update-addons.component';
import { AddonsRoutingModule } from './addons-routing.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {PickListModule} from 'primeng/picklist';
import {PanelModule} from 'primeng/panel';



@NgModule({
  declarations: [
    AddonslistComponent,
    InsertUpdateAddonsComponent
  ],
  imports: [
    AdminSharedModule,
    AppSharedModule,
    AddonsRoutingModule,
    PickListModule,
    PanelModule
  ]
})
export class AddonsModule { }
