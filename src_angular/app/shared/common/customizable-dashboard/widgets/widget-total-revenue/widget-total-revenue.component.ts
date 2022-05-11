import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { HostDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { filter as _filter } from 'lodash-es';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-widget-total-revenue',
  templateUrl: './widget-total-revenue.component.html',
  styleUrls: ['./widget-total-revenue.component.css']
})
export class WidgetTotalRevenueComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {

  FilterValue: string
  loadingTotalRevenueStatistics = true;
  selectedDateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];
  totalRevenueData: any = [];
  incomeStatisticsHasData = false;
  view: any[] = [0, 0];
  filterValue = ["Product"] 
  SelectedFilterName: string;
  public yAxisTickFormattingFn = this.yAxisTickFormatting.bind(this);

  @ViewChild('filterModal', { static: true }) modal: ModalDirective;
  constructor(injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy,
    private _dateTimeService: DateTimeService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.runDelayed(this.loadTotalRevenueData);
  }
  yAxisTickFormatting(value) {
    return value + " $" // this is where you can change the formatting
  }
  loadTotalRevenueData = () => {
    this.loadingTotalRevenueStatistics = true;
    this._hostDashboardServiceProxy.getTotalRevenueForWidget(
      this.filterValue
    ).subscribe(result => {
      this.totalRevenueData = result;
      this.loadingTotalRevenueStatistics = false;
    });
  }

  onChangeCheckBoxvalue(event, FilterName: string) {
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
    this.loadTotalRevenueData()
    setTimeout(() => {
      document.getElementById("close").click()
    }, 150);

  }
  
}
