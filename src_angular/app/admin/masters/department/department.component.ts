import { DepartmentListDto, DepartmentServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { CreateOrEditDepartmentComponent } from './create-or-edit-department/create-or-edit-department.component';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  animations: [appModuleAnimation()]
})
export class DepartmentComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createOrEditDepartment', { static: true }) createOrEditDepartment: CreateOrEditDepartmentComponent;
   @ViewChild('createOrEditDepartment', { static: true }) modal: ModalDirective;
   @ViewChild('dt', { static: true }) dataTable: Table;
   @ViewChild('paginator', { static: true }) paginator: Paginator;

   departmentListDto: DepartmentListDto[] = [];
   departmentList: DepartmentListDto;
   filterText = '';
   constructor(injector: Injector, private _Department: DepartmentServiceProxy, private _activatedRoute: ActivatedRoute) {
     super(injector);
     this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
   }

   ngAfterViewInit() {
    this.getallDepartmentList();
  }
 
   getallDepartmentList(event?: LazyLoadEvent, isSubmit:boolean = false) {
     if(isSubmit==true){
      this.filterText = "";
     }
     if (this.primengTableHelper.shouldResetPaging(event)) {
       this.paginator.changePage(0);
       return;
     }
     this.primengTableHelper.showLoadingIndicator();
     this._Department.getDepartment(
      this.filterText,
      this.primengTableHelper.getSorting(this.dataTable),
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event)
      
     ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.records=result.items
  this.primengTableHelper.totalRecordsCount = result.totalCount;
  this.departmentListDto=result.items;
  this.primengTableHelper.hideLoadingIndicator(); 
     });
   }
 
  
 
   createDepartment(): void {
     this.createOrEditDepartment.show();
   }
 
   deleteDepartment(Department) {
     this.message.confirm
       (
         this.l('DepartmentDeleteWarningMessage', Department.vcDepartmentName),
         this.l('AreYouSure'),
         (isConfirmed) => {
           if (isConfirmed) {
             this._Department.deleteDepartment(Department.inDepartmentID).subscribe(() => {
               this.notify.info(this.l('SuccessfullyDeleted'));
               this.getallDepartmentList();
             });
           }
         }
       )
   }
 }
 
 