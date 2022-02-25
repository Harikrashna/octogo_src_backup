import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AirlineServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditAirlineComponent } from './create-or-edit-airline/create-or-edit-airline.component';


@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.css'],
  animations: [appModuleAnimation()]
})
export class AirlineComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createOrEditAirline', { static: true }) createOrEditAirline: CreateOrEditAirlineComponent;
  @ViewChild('createOrEditAirline', { static: true }) modal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  Airline: any;
  filterText = '';
  constructor(injector: Injector, private _Airline: AirlineServiceProxy, private _activatedRoute: ActivatedRoute) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  getallAirlineList(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();
    this._Airline.getAirline(

      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
      this.primengTableHelper.getSorting(this.dataTable),
      this.filterText,
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.records = result.items
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.Airline = result.items;
      this.primengTableHelper.hideLoadingIndicator();
    });
  }

  ngAfterViewInit() {
    this.getallAirlineList();
  }

  createAirline(): void {
    this.createOrEditAirline.show();
  }

  deleteAirline(Airline) {
    this.message.confirm
      (
        this.l('AirlineDeleteWarningMessage', Airline.vcAirlineName),
        this.l('AreYouSure'),
        (isConfirmed) => {
          if (isConfirmed) {
            this._Airline.deleteAirline(Airline.inAirlineID).subscribe(() => {
              this.notify.info(this.l('SuccessfullyDeleted'));
              this.getallAirlineList();
            });
          }
        }
      )
  }
}

