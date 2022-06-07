import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
  selector: 'app-widget-awbcounts',
  templateUrl: './widget-awbcounts.component.html',
  styleUrls: ['./widget-awbcounts.component.css']
})
export class WidgetAwbcountsComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {
  @ViewChild('filterModal', { static: true }) modal: ModalDirective;

  loadingTotalAwbCountsStatistics = true;
  view: any[] = [0, 0];
  totalAwbCountsStatisticsData: any[];
  selectedDateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];
  creationDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];

  constructor(injector: Injector, private _dashboardCustomizationService: DashboardCustomizationServiceProxy, private _dateTimeService: DateTimeService) {
    super(injector);
  }

  ngOnInit(): void {
    this.runDelayed(this.loadTotalAwbCountsData);
  }
  loadTotalAwbCountsData = () => {
    this.loadingTotalAwbCountsStatistics = true;
    this._dashboardCustomizationService.getAWBCountsByTenantId(
      this.appSession.tenantId,
      this.selectedDateRange[0],
      this.selectedDateRange[1], 0
    ).subscribe(result => {
      this.totalAwbCountsStatisticsData = result;
      this.loadingTotalAwbCountsStatistics = false;
    });
  }

  onDateRangeFilterChange = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
      return;
    }

    this.selectedDateRange[0] = dateRange[0];
    this.selectedDateRange[1] = dateRange[1];
    this.runDelayed(this.loadTotalAwbCountsData);
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
