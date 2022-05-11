import { Component, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { GetRecentTenantsOutput, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-widget-octogen-products',
  templateUrl: './widget-octogen-product.component.html',
  styleUrls: ['./widget-octogen-product.component.css']
})
export class WidgetOctogenProductsComponent extends WidgetComponentBaseComponent {
  @ViewChild('RecentTenantsTable', { static: true }) recentTenantsTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  
  constructor(injector: Injector,
    private _editionService: EditionServiceProxy,
    ) {
    super(injector);
    this.getEditionsAndProduct();
  }

  loading = true;

  recentTenantsData: GetRecentTenantsOutput;

  getEditionsAndProduct(): void {

    this.primengTableHelper.showLoadingIndicator();
    this._editionService.getEditionsList("",
      "EditionName ASC",
      10,
      0
    )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
      .subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

}
