import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { HostDashboardServiceProxy } from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { WidgetComponentBaseComponent } from '../widget-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'widget-product-segment',
    templateUrl: './widget-product-segment.component.html',
    // styleUrls: ['./widget-product-segment.component.css']
})
export class WidgetProductSegmentComponent extends WidgetComponentBaseComponent implements OnInit, OnDestroy {

    loadingProductWiseClientStatistics = true
    productWiseClientStatisticsData: any = [];
    showLegend = true;
    showLabels: boolean = true;
    @ViewChild('filterModal', { static: true }) modal: ModalDirective;
    constructor(injector: Injector,
        private _hostDashboardServiceProxy: HostDashboardServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.runDelayed(this.loadProductWiseClientStatisticsData);
    }

    loadProductWiseClientStatisticsData = () => {
        debugger
        this.loadingProductWiseClientStatistics = true;
        this._hostDashboardServiceProxy.getTotalClientWithFilterForWidget(
            ["PRODUCT"]
        ).subscribe(result => {
            this.productWiseClientStatisticsData = this.normalizeProductWiseClientStatisticsData(result);
            this.loadingProductWiseClientStatistics = false;
        });
    }
    normalizeProductWiseClientStatisticsData(data): any {
        debugger
        const chartData = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].series.length; j++) {
                chartData.push({
                    'name': data[i].series[j].name,
                    'value': data[i].series[j].value
                });
            }
            return chartData
        }
    }
}
