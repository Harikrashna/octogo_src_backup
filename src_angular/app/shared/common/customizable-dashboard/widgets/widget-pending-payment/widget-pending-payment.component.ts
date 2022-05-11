import { Component, ViewChild, Injector } from '@angular/core';
import { Table } from 'primeng/table';
import { HostDashboardServiceProxy, GetRecentTenantsOutput } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { Paginator } from 'primeng/paginator';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-widget-pending-payment',
  templateUrl: './widget-pending-payment.component.html',
  styleUrls: ['./widget-pending-payment.component.css']
})
export class WidgetPendingPaymentComponent extends WidgetComponentBaseComponent {
  @ViewChild('RecentTenantsTable', { static: true }) recentTenantsTable: Table;
  @ViewChild('paginator', {static: true}) paginator: Paginator;
  @ViewChild('dataTable', {static: true}) dataTable: Table;

  selectedDateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];
  creationDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];
  constructor(injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy,
    private _dateTimeService: DateTimeService) {
    super(injector);
  }
  ngOnInit() {
    this.subDateRangeFilter();
    this.runDelayed(this.getClientPendingPayment);
  }
  loading = true;
  
 getClientPendingPayment = () =>  {
    this.primengTableHelper.showLoadingIndicator();
    this._hostDashboardServiceProxy.getClientPendingPaymentForWidget(   
        this.selectedDateRange[0],
        this.selectedDateRange[1]).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
        debugger
    });
  }
  onDateRangeFilterChange = (dateRange) => {
  if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
    return;
  }

  this.selectedDateRange[0] = dateRange[0];
  this.selectedDateRange[1] = dateRange[1];
  this.runDelayed(this.getClientPendingPayment);
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
