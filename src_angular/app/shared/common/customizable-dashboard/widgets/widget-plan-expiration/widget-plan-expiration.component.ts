import { Component, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs/operators';
import { SubscriptionServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'app-widget-plan-expiration',
    templateUrl: './widget-plan-expiration.component.html',
    styleUrls: ['./widget-plan-expiration.component.css']
})
export class WidgetPlanExpirationComponent extends WidgetComponentBaseComponent {
    @ViewChild('RecentTenantsTable', { static: true }) recentTenantsTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    constructor(injector: Injector,
        private _subscriptionAppService: SubscriptionServiceProxy) {
        super(injector);
        this.getPlanExpiration();
    }
    getPlanExpiration(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._subscriptionAppService.getClientSubscriptionExpirationAndProductForWidget()
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

}
