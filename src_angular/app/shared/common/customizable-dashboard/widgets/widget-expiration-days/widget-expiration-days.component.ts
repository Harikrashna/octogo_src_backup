import { Component, Injector, OnInit } from '@angular/core';
import { TenantEditionAddonDto, SubscribedStandAloneAddonDto, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBaseComponent } from '../widget-component-base';

@Component({
  selector: 'app-widget-expiration-days',
  templateUrl: './widget-expiration-days.component.html',
  styleUrls: ['./widget-expiration-days.component.css']
})
export class WidgetExpirationDaysComponent extends WidgetComponentBaseComponent implements OnInit {
  productDetailsList: TenantEditionAddonDto[]=[];
  StandAloneAddonList: SubscribedStandAloneAddonDto[]=[];
  loading:boolean;
  dataFetched: boolean = false;

  constructor(private _dashboardCustomizationService: DashboardCustomizationServiceProxy, injector: Injector) {
    super(injector)
   }

   ngOnInit() {
     debugger
    this.productDetailsList = new Array<TenantEditionAddonDto>();
    this.StandAloneAddonList = new Array<SubscribedStandAloneAddonDto>()
    this.loading = true;
    this.dataFetched = false;
      this._dashboardCustomizationService.getTenantEditionAddonDetailsByTenantId(this.appSession.tenantId)
      .subscribe(result => {
        this.loading = false;
        this.dataFetched = true;
        if(result != null){
           this.productDetailsList = result.tenantEditionAddon;
           console.log(this.productDetailsList);
        }
      });
    }

}
