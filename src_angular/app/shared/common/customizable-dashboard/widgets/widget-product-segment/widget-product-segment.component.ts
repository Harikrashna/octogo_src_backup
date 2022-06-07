import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { HostDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTime } from 'luxon';

@Component({
    selector: 'widget-product-segment',
    templateUrl: './widget-product-segment.component.html',
    // styleUrls: ['./widget-product-segment.component.css']
})
export class WidgetProductSegmentComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {

    loadingProductWiseClientStatistics = true
    productWiseClientStatisticsData: any = [];
    showLegend = true;
    totalClients = 0;
    showLabels: boolean = true;
    @ViewChild('filterModal', { static: true }) modal: ModalDirective;
    selectedDateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];
  creationDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];
    constructor(injector: Injector,
        private _hostDashboardServiceProxy: HostDashboardServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.subDateRangeFilter();
        this.runDelayed(this.loadProductWiseClientStatisticsData);
    }

    loadProductWiseClientStatisticsData = () => {
        
        this.loadingProductWiseClientStatistics = true;
        this._hostDashboardServiceProxy.getTotalClientWithFilterForWidget(
            ["PRODUCT"],
            this.selectedDateRange[0],
            this.selectedDateRange[1],

        ).subscribe(result => {
            this.productWiseClientStatisticsData = this.normalizeProductWiseClientStatisticsData(result);
            this.loadingProductWiseClientStatistics = false;
        });
    }
    normalizeProductWiseClientStatisticsData(data): any {

      const chartData = [];
      this.totalClients = 0;
      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < data[i].series?.length; j++) {
          chartData.push({
            'name': data[i].series[j].name,
            'value': data[i].series[j].value
          });
          this.totalClients = this.totalClients + data[i].series[j].value;
        }
        return chartData
        }
    }
    onDateRangeFilterChange = (dateRange) => {
        if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
          return;
        }
      
        this.selectedDateRange[0] = dateRange[0];
        this.selectedDateRange[1] = dateRange[1];
        this.runDelayed(this.loadProductWiseClientStatisticsData);
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
