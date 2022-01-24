import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditionSelectionComparisonComponent } from './edition-selection-comparison/edition-selection-comparison.component';

const routes: Routes = [
  {
    path:'',
    component:EditionSelectionComparisonComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditionSelectionComparisonRoutingModule { }
