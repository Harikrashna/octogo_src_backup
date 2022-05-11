import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { ChartDateInterval, HostDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';

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
  constructor(injector: Injector,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.runDelayed(this.loadTotalClientData);
  }

  loadTotalClientData = () => {
    this.loadingTotalClientStatistics = true;
    this._hostDashboardServiceProxy.getTotalClientWithFilterForWidget(
      this.filterValue
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
  

}
