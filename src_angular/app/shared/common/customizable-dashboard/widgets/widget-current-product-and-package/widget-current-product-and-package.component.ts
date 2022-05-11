import { Router } from '@angular/router';
import { WidgetComponentBaseComponent } from './../widget-component-base';
import { Component, Injector, OnInit } from '@angular/core';
import { TenantEditionAddonDto, SubscribedStandAloneAddonDto, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-widget-current-product-and-package',
  templateUrl: './widget-current-product-and-package.component.html',
  styleUrls: ['./widget-current-product-and-package.component.css']
})
export class WidgetCurrentProductAndPackageComponent extends WidgetComponentBaseComponent implements OnInit {
  productDetailsList: TenantEditionAddonDto[]=[];
  StandAloneAddonList: SubscribedStandAloneAddonDto[]=[];
  loading:boolean;
  dataFetched: boolean = false;

  constructor(private _dashboardCustomizationService: DashboardCustomizationServiceProxy,private _route : Router, injector: Injector) {
    super(injector)
   }

   ngOnInit() {
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
           this.StandAloneAddonList = result.standAloneAddon;
          //  this.productDetailsList.push(result[0]);
          //  this.CheckScrollable();
          console.log(this.productDetailsList);
          console.log(this.StandAloneAddonList);
        }
      });
    }
    upgrade(){
      this._route.navigateByUrl("/app/admin/subscription-management")
    }

}
