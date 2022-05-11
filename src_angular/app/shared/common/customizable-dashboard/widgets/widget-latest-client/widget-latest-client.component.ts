import { Component, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { GetRecentTenantsOutput, TenantServiceProxy, GetTenantsInputNew } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-widget-latest-client',
  templateUrl: './widget-latest-client.component.html',
  styleUrls: ['./widget-latest-client.component.css']
})
export class WidgetLatestClientComponent extends WidgetComponentBaseComponent {
  @ViewChild('RecentTenantsTable', { static: true }) recentTenantsTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dataTable', { static: true }) dataTable: Table;

  constructor(injector: Injector,
    private _tenantService: TenantServiceProxy,
    private _router: Router,) {
    super(injector);
    this.getTenants();
  }

  loading = true;

  recentTenantsData: GetRecentTenantsOutput;
  getTenants() {

    this.primengTableHelper.showLoadingIndicator();
    let input = new GetTenantsInputNew();
    input.sorting = "creationTime DESC";
    input.maxResultCount = 5;
    this._tenantService.getTenantsNew(input).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.primengTableHelper.records = result.items;
      this.primengTableHelper.hideLoadingIndicator();
      debugger
    });
  }
  gotoAllTenants() {
    this._router.navigate(['app/admin/tenants'])
  }


}
