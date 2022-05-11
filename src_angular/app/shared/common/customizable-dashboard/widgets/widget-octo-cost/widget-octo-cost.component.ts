import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DashboardCustomizationServiceProxy} from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { filter as _filter } from 'lodash-es';
import { DateTime } from 'luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
@Component({
  selector: 'app-widget-octo-cost',
  templateUrl: './widget-octo-cost.component.html',
  styleUrls: ['./widget-octo-cost.component.css']
})
export class WidgetOctoCostComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {

  FilterValue: string
  loadingTotalOctoCostStatistics = true;
  view: any[] = [0, 0];
  totalOctoCostStatisticsData: any = [];
  filterValue = ['Product'];
  model: selection;

  @ViewChild('filterModal', { static: true }) modal: ModalDirective;
  userType: string;
  selectedDateRange: DateTime[] = [this._dateTimeService.getStartOfDayMinusDays(7), this._dateTimeService.getEndOfDay()];
  creationDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];
  constructor(injector: Injector, private _dashboardCustomizationService: DashboardCustomizationServiceProxy, 
    private _dateTimeService: DateTimeService) {
    super(injector);
    this.model = new selection();
  }

  ngOnInit() {
    //If UserType is Airline
    this.model.products=true;
    this.userType = this.appSession.user.userTypeName
    this.subDateRangeFilter();
    this.runDelayed(this.loadTotalOctoCostData);

  }
  
  loadTotalOctoCostData = () => {
    this.loadingTotalOctoCostStatistics = true;
    this._dashboardCustomizationService.getTotalOctoCostWidget(
      this.filterValue, this.appSession.tenantId,
      this.selectedDateRange[0],
      this.selectedDateRange[1],
    ).subscribe(result => {
      this.totalOctoCostStatisticsData = result;
      console.log(result);
      this.loadingTotalOctoCostStatistics = false;
    });
  }

  onChangeCheckBoxvalue(event, FilterName: string) {
    let index = this.filterValue.findIndex(x => x == FilterName);
    if (event.target.checked == true && FilterName == 'ADDON' || FilterName == 'PACKAGE' || FilterName == 'PRODUCT') {
      var standaloneIndex = this.filterValue.indexOf("STANDALONE")
      if (standaloneIndex == 0) {
        this.filterValue.splice(standaloneIndex, 1)
      }
      this.model.standalones = false;
      if (index == -1)
        this.filterValue.push(FilterName);
      else {
        if (index >= 0) {
          this.filterValue.splice(index, 1);
        }
      }
    }
    else if (event.target.checked == true && FilterName == 'STANDALONE') {
      this.filterValue = [];
      this.model.addons = false;
      this.model.packages = false;
      this.model.products = false;
      if (index == -1)
        this.filterValue.push(FilterName);
    }
    else {
      if (index >= 0) {
        this.filterValue.splice(index, 1);
      }
    }
    this.loadTotalOctoCostData()
    setTimeout(()=>{
      document.getElementById("close").click()
    },150);
  }
  onDateRangeFilterChange = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
      return;
    }

    this.selectedDateRange[0] = dateRange[0];
    this.selectedDateRange[1] = dateRange[1];
    this.runDelayed(this.loadTotalOctoCostData);
  }

  myYAxisTickFormatting(val) {
    return '$' + val;
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
export class selection {
  packages: any;
  standalones: any;
  addons: any;
  products: any;
}