import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { ChartDateInterval, HostDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
  selector: 'app-widget-total-client',
  templateUrl: './widget-total-client.component.html',
  styleUrls: ['./widget-total-client.component.css']
})
export class WidgetTotalClientComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {
  FilterValue: string
  loadingTotalClientStatistics = true;
  incomeStatisticsHasData = false;
  view: any[] = [0, 0];
  totalClientStatisticsData: any = [];
  filterValue = ["USERTYPE"]
 

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
    this.runDelayed(this.loadTotalClientData);
  }

  loadTotalClientData = () => {
    this.loadingTotalClientStatistics = true;
    this._hostDashboardServiceProxy.getTotalClientWithFilterForWidget(
      this.filterValue,
      this.selectedDateRange[0],
      this.selectedDateRange[1],
    ).subscribe(result => {
      this.totalClientStatisticsData = result;
      this.loadingTotalClientStatistics = false;
    });
  }

  onChangeCheckBoxvalue(event, FilterName: string) {
    this.loadingTotalClientStatistics = true;
    let index = this.filterValue.findIndex(fv => fv == FilterName);
    
    if (event.target.checked == true) {
      if (index == -1)
        this.filterValue.push(FilterName);
    }
    else {
      if (index >= 0) {
        this.filterValue.splice(index, 1);
      }
    } 
    this.loadTotalClientData()
    setTimeout(() => {
      document.getElementById("close").click()
    }, 150);
   

  }
  onDateRangeFilterChange = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
      return;
    }
  
    this.selectedDateRange[0] = dateRange[0];
    this.selectedDateRange[1] = dateRange[1];
    this.runDelayed(this.loadTotalClientData);
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
