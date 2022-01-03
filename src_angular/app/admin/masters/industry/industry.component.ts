import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { IndustryServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditIndustryComponent } from './create-or-edit-industry/create-or-edit-industry.component';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.css'],
  animations: [appModuleAnimation()]
})
export class IndustryComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createOrEditIndustry', { static: true }) createOrEditIndustry: CreateOrEditIndustryComponent;
   @ViewChild('createOrEditIndustry', { static: true }) modal: ModalDirective;
   @ViewChild('dataTable', { static: true }) dataTable: Table;
   @ViewChild('paginator', { static: true }) paginator: Paginator;
   Industry: any;
   filterText = '';
   constructor(injector: Injector, private _Industry: IndustryServiceProxy, private _activatedRoute: ActivatedRoute) {
     super(injector);
     this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
   }
 
   getallIndustryList(event?: LazyLoadEvent, isSubmit:boolean = false) {
    if(isSubmit == true){
      this.filterText = "";
     }
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();
    this._Industry.getIndustry(
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
      this.primengTableHelper.getSorting(this.dataTable),
      this.filterText,
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
     this.primengTableHelper.records=result.items
     this.primengTableHelper.totalRecordsCount = result.totalCount;
     this.Industry=result.items;
     this.primengTableHelper.hideLoadingIndicator();   
    });
  }
 
 
   ngAfterViewInit() {
     this.getallIndustryList();
   }
 
   createIndustry(): void {
     this.createOrEditIndustry.show();
   }
 
   deleteIndustry(Industry) {
     this.message.confirm
       (
         this.l('IndustryDeleteWarningMessage', Industry.vcIndustryName),
         this.l('AreYouSure'),
         (isConfirmed) => {
           if (isConfirmed) {
             this._Industry.deleteIndustry(Industry.inIndustryID).subscribe(() => {
               this.notify.info(this.l('SuccessfullyDeleted'));
               this.getallIndustryList();
             });
           }
         }
       )
   }
 }
 
 