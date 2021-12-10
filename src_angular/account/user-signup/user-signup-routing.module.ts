
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { UserSignUpModule } from './user-signup.module';

const routes: Routes = [
{
  path: 'user-sign-up',
  component: UserSignUpComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSignUpRoutingModule { }
 