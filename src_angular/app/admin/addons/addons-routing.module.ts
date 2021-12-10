import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AddonslistComponent } from './addonslist/addonslist.component';


const routes: Routes = [{
    path: '',
    component: AddonslistComponent,
    pathMatch: 'full'
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AddonsRoutingModule {
}
