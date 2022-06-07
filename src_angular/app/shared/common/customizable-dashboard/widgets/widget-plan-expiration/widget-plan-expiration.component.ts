import { Component, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs/operators';
import { SubscriptionServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';


@Component({
    selector: 'app-widget-plan-expiration',
    templateUrl: './widget-plan-expiration.component.html',
    styleUrls: ['./widget-plan-expiration.component.css']
})
export class WidgetPlanExpirationComponent extends WidgetComponentBaseComponent {
    @ViewChild('RecentTenantsTable', { static: true }) recentTenantsTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    selectedDateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];
    creationDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];
    constructor(injector: Injector,
        private _subscriptionAppService: SubscriptionServiceProxy,
        private _dateTimeService: DateTimeService)
         {
        super(injector);
        
    }
   
    ngOnInit() {
        this.subDateRangeFilter();
        this.runDelayed(this.getPlanExpiration);
    }
    getPlanExpiration = () => {
        this.primengTableHelper.showLoadingIndicator();
        this._subscriptionAppService.getClientSubscriptionExpirationAndProductForWidget(
            this.selectedDateRange[0],
            this.selectedDateRange[1],
        )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe(result => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                debugger
                this.primengTableHelper.hideLoadingIndicator();
            });
    }
    onDateRangeFilterChange = (dateRange) => {
        if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
          return;
        }
      
        this.selectedDateRange[0] = dateRange[0];
        this.selectedDateRange[1] = dateRange[1];
        this.runDelayed(this.getPlanExpiration);
      }
        subDateRangeFilter() {
          abp.event.on('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
        }
      
        unSubDateRangeFilter() {
          abp.event.off('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
        }
        ngOnDestroy(): void {
          this.unSubDateRangeFilter();
        }
}
