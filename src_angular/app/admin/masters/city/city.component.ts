import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionTreeModalComponent } from '@app/admin/shared/permission-tree-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CityServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditCityComponent } from './create-or-edit-city/create-or-edit-city.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
  animations: [appModuleAnimation()]
})
export class CityComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createOrEditCity', { static: true }) createOrEditCity: CreateOrEditCityComponent;
  @ViewChild('createOrEditCity', { static: true }) modal: ModalDirective;
  @ViewChild('permissionFilterTreeModal', { static: true }) permissionFilterTreeModal: PermissionTreeModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  perCity: any;
  filterText = '';
  
  constructor(injector: Injector, private _Cityservice: CityServiceProxy, private _modalService: BsModalService, private _activatedRoute: ActivatedRoute) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }
  ngAfterViewInit(): void {
    // this.GetCityList();
  }
  GetCityList(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();
    this._Cityservice.getCityList(
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
      this.primengTableHelper.getSorting(this.dataTable),
      this.filterText
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.records=result.items
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.perCity=result.items;
      this.primengTableHelper.hideLoadingIndicator();   
     
    });
  }
  
  createCity(): void {
    this.createOrEditCity.show();
  }

  // deleteCity(City) {
  //   this.message.confirm(
  //     this.l('CityDeleteWarningMessage', City.cityName),
  //     this.l('AreYouSure'),
  //     isConfirmed => {
  //       if (isConfirmed) {
  //         this._Cityservice.deleteCity(City.sNo).subscribe(() => {
  //           abp.notify.success(this.l('SuccessfullyDeleted'));
  //           this.GetPerCityList();
  //         });
  //       }
  //     }
  //   )
  // }
}
