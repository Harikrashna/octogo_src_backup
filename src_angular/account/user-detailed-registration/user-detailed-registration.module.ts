import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailedRegistrationRoutingModule } from './user-detailed-registration-routing.module';
import { UserDetailedRegistrationComponent } from './user-detailed-registration/user-detailed-registration.component';
import { AccountSharedModule } from '@account/shared/account-shared.module';
import { AppSharedModule } from '@app/shared/app-shared.module';


@NgModule({
  declarations: [
    UserDetailedRegistrationComponent
  ],
  imports: [
    CommonModule,
    UserDetailedRegistrationRoutingModule,
    AccountSharedModule,
    AppSharedModule
  ]
})
export class UserDetailedRegistrationModule { }
