import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AccountSharedModule } from '@account/shared/account-shared.module';
import { PasswordModule } from 'primeng/password';
import { UserSignUpRoutingModule } from './user-signup-routing.module';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';


@NgModule({
  declarations: [UserSignUpComponent],
  imports: [
    CommonModule,
    AppSharedModule, 
    AccountSharedModule, 
    PasswordModule,
    UserSignUpRoutingModule
  ]
})
export class UserSignUpModule { }
 