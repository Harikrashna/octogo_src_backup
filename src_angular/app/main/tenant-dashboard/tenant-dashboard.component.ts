import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-tenant-dashboard',
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css'],
  animations: [appModuleAnimation()]
})
export class TenantDashboardComponent extends AppComponentBase implements OnInit {
  productDetails = [];
  constructor( injector: Injector,  private _dashboardService: DashboardCustomizationServiceProxy,) { 
    super(injector);
  }
  ngOnInit() {
    this.spinnerService.show();
    this._dashboardService.getProductAndEditionDetailByUserId(this.appSession.userId)
    .subscribe(result => {
      this.spinnerService.hide();
      if(result != null){
         this.productDetails = result.items;
      }
    });      
  }
}
