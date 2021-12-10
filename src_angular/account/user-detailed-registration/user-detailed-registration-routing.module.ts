import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailedRegistrationComponent } from './user-detailed-registration/user-detailed-registration.component';


const routes: Routes = [{
  path: '',
  component: UserDetailedRegistrationComponent,
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDetailedRegistrationRoutingModule { }
