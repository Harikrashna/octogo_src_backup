import { Component, Input, OnInit, Output, ViewChild, EventEmitter, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantEditionAddonDto } from '@shared/service-proxies/service-proxies';
import { TenantProductSetupSummaryComponent } from '../tenant-product-setup-summary/tenant-product-setup-summary.component';


@Component({
  selector: 'app-shared-package-details',
  templateUrl: './shared-package-details.component.html',
  styleUrls: ['./shared-package-details.component.css']
})
export class SharedPackageDetailsComponent  extends AppComponentBase implements OnInit {
  @ViewChild('tenantSummaryModel', {static: true}) tenantSummaryModel: TenantProductSetupSummaryComponent;

  @Input() PackageDetails: TenantEditionAddonDto;
  @Input() ForDashboard = false;
  @Input() Selected = false;
  @Output() showPackageDetails = new EventEmitter();


  isAddonCollapsed = false;
  addonIndex = null;
  constructor(private _router: Router,injector: Injector) { 
    super(injector)
  }

  ngOnInit(): void {
    this.PackageDetails
  
  }
  // checkExpiryTime(remainingDays) {  commented by:merajuddin
  //   if (remainingDays <= 7) {
  //     debugger
  //     return true
     
  //   }
  //   return false;
  // }
  checkExpiryTime(remainingDays, expiryNotificationDays) {  
    if (remainingDays > 0) {
      if (remainingDays <= expiryNotificationDays) {
        return true
      }
    }
    return false;
  }
  checkProcess(process) {
    if (process == false) {
      return true;
    }
    return false;
  }
  GoToSubscription() {
    this._router.navigate(['app/admin/subscription-management'], { queryParams: { editionId: this.PackageDetails.editionId }, queryParamsHandling: 'merge' });
  }
  GoToProduct(url){
    window.open(url, "_blank");
  }
  expandAddons(index) {
    this.addonIndex = index;
    this.isAddonCollapsed = !this.isAddonCollapsed;
  }
  CalculateExpiryPercentage(startDate, endDate, remainingDays){
    var date1 = new Date(startDate); 
    var date2 = new Date(endDate); 
    
      var Time = date2.getTime() - date1.getTime(); 
      var totalDays = Math.floor(Time / (1000 * 3600 * 24));
      let remainPercentage = (remainingDays * 100)/totalDays;
      let color = "green"
      if(remainingDays <= 7) color = "red";
      if(remainingDays > 7 && remainingDays <= 15) color = "orange";
      
      return "width: "+remainPercentage+"%;background: "+color+";"
  }
  OpenTenantSetupSummary(packageDetails){
    this.tenantSummaryModel.Show(packageDetails.productId, packageDetails.productName);
  }
  DetailedInformation(){
    this.showPackageDetails.emit(null);
  }
}
function injector(injector: any) {
  throw new Error('Function not implemented.');
}

