
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DesignationServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrUpdateDesignationComponent } from './create-or-update-designation/create-or-update-designation.component';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
  animations: [appModuleAnimation()]
})
export class DesignationComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditDesignation', {static: true}) createOrEditDesignation: CreateOrUpdateDesignationComponent;
  @ViewChild('dataTable', {static: true}) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  records:any
  filterText = '';
  constructor(injector: Injector,private _designation:DesignationServiceProxy, private _activatedRoute: ActivatedRoute) { 
     super(injector);
  this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }
 

  ngOnInit(): void {
  }
  edit(record){
    this.createOrEditDesignation.show(record)
  }
  getDesignation(event? :LazyLoadEvent, isSubmit:boolean = false):void{
    if(isSubmit == true){
      this.filterText = "";
     }
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
  }
    this._designation.getDesignation(
      this.filterText,
      this.primengTableHelper.getSorting(this.dataTable),
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
    .subscribe(result => {
        this.primengTableHelper.records=result.items
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.records=result.items;
        this.primengTableHelper.hideLoadingIndicator();   

    });    
  }
  
  createDesignation(): void {
    this.createOrEditDesignation.show();
  }
  deleteDesignation(data): void {
    this.message.confirm(
        this.l('DesignationDeleteWarningMessage', data.designationName),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
              this._designation.deleteDesignation(data.id).subscribe(() => {
                this.getDesignation();
                  abp.notify.info(this.l('SuccessfullyDeleted'));
            });
      
            }
        }
    );
  }

}



