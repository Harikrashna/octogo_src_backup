import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditUsertypeComponent } from './create-or-edit-usertype/create-or-edit-usertype.component';

@Component({
  selector: 'app-usertype',
  templateUrl: './usertype.component.html',
  styleUrls: ['./usertype.component.css'],
  animations: [appModuleAnimation()]
})
export class UsertypeComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createOrEditUserType', { static: true }) createOrEditUserType: CreateOrEditUsertypeComponent;
   @ViewChild('createOrEditUserType', { static: true }) modal: ModalDirective;
   @ViewChild('dataTable', { static: true }) dataTable: Table;
   @ViewChild('paginator', { static: true }) paginator: Paginator;
   UserType: any;
   filterText = '';
   constructor(injector: Injector, private _UserType: UserTypeServiceProxy, private _activatedRoute: ActivatedRoute) {
     super(injector);
     this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
   }
   ngAfterViewInit() {
    this.getallUserTypeList();
  }

 
   getallUserTypeList(event?: LazyLoadEvent, isSubmit:boolean = false) {
     if(isSubmit == true){
      this.filterText = "";
     }
     if (this.primengTableHelper.shouldResetPaging(event)) {
       this.paginator.changePage(0);
       return;
     }
     this.primengTableHelper.showLoadingIndicator();
     this._UserType.getUserTypeList(
       this.primengTableHelper.getMaxResultCount(this.paginator, event),
       this.primengTableHelper.getSkipCount(this.paginator, event),
       this.primengTableHelper.getSorting(this.dataTable),
       this.filterText,
     ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.primengTableHelper.records = result.items;
      this.UserType = result.items;
      this.primengTableHelper.hideLoadingIndicator();
     });
   }
 
  
   createUserType(): void {
     this.createOrEditUserType.show();
   }
 
   deleteUserType(UserType) {
     this.message.confirm
       (
         this.l('UserTypeDeleteWarningMessage', UserType.vcUserTypeName),
         this.l('AreYouSure'),
         (isConfirmed) => {
           if (isConfirmed) {
             this._UserType.deleteUserType(UserType.inUserTypeID).subscribe(() => {
               this.notify.info(this.l('SuccessfullyDeleted'));
               this.getallUserTypeList();
             });
           }
         }
       )
   }
 }
 
 
 
 