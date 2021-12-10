import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, Injector, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditServicesComponent } from './create-or-edit-services/create-or-edit-services.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  animations: [appModuleAnimation()]
  
})
export class ServicesComponent extends AppComponentBase implements AfterViewInit {
 @ViewChild('createOrEditServices', { static: true }) createOrEditServices: CreateOrEditServicesComponent;
  @ViewChild('createOrEditServices', { static: true }) modal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  Services: any;
  filterText = '';
  constructor(injector: Injector, private _services: ServicesServiceProxy, private _activatedRoute: ActivatedRoute) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  getallServicesList(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();
    this._services.getService(
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
      this.primengTableHelper.getSorting(this.dataTable),
      this.filterText,
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.primengTableHelper.totalRecordsCount = result.items.length;
      this.primengTableHelper.records = result.items;
      this.Services = result.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }

  ngAfterViewInit() {
    this.getallServicesList();
  }

  createServices(): void {
    this.createOrEditServices.show();
  }

  deleteServices(Services) {
    this.message.confirm
      (
        this.l('ServiceDeleteWarningMessage', Services.vcServiceName),
        this.l('AreYouSure'),
        (isConfirmed) => {
          if (isConfirmed) {
            this._services.deleteService(Services.inServiceID).subscribe(() => {
              this.notify.info(this.l('SuccessfullyDeleted'));
              this.getallServicesList();
            });
          }
        }
      )
  }
}



