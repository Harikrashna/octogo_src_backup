import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationServiceProxy, TenantEditionAddonDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-subscribed-products-details',
  templateUrl: './subscribed-products-details.component.html',
  styleUrls: ['./subscribed-products-details.component.css']
})
export class SubscribedProductsDetailsComponent extends AppComponentBase implements OnInit {
  @Input() ForDashboard = false;

  productDetailsList: TenantEditionAddonDto[]=[];
  showDetailedInformation: boolean = false;
  showEditionInformation:boolean = true;
  scrollLength = 500;
  IsScrollable: boolean = false;
  CanScrollLeft: boolean = false;
  CanScrollRight: boolean = false;
  SelectedPackage:TenantEditionAddonDto = null;
  loading:boolean;
  selectedIndex = -1;
  constructor( injector: Injector,  private _dashboardService: DashboardCustomizationServiceProxy,) { 
    super(injector);
  }
  ngOnInit() {
  this.productDetailsList = new Array<TenantEditionAddonDto>();
  this.loading = true;
    this._dashboardService.getTenantEditionAddonDetailsByTenantId(this.appSession.tenantId)
    .subscribe(result => {
      this.loading = false;
      if(result != null && result.length > 0){
         this.productDetailsList = result;
        //  this.CheckScrollable();
        if(!this.ForDashboard){
        this.ShowPackageDetails(0);
        }
      }
    });      
   }
   ShowPackageDetails(prodIndex){
     this.selectedIndex = prodIndex;
     // call detail edition data API here
     this.showDetailedInformation = true;
     this.SelectedPackage = this.productDetailsList[prodIndex];
   }
   upgradeClicked(){
    this.showEditionInformation = false;
    this.selectedIndex = -1;
   }
   BackToSubscribedProducts(){
     debugger
    this.showEditionInformation = true;
    this.ShowPackageDetails(0);
   }
  // ScrollLeft() {
  //   let scroll = this.scrollLength;
  //   let ele = document.getElementById('product_content')
  //   ele.scrollLeft -= scroll;
  //   this.CanScrollRight = true;
  //   this.CanScrollLeft = ele.scrollLeft > 0;
  // }
 
  // ScrollRight() {
  //   let scroll = this.scrollLength;
  //   let ele = document.getElementById('product_content')
  //   this.CanScrollLeft = true;
  //   if ((ele.scrollWidth - ele.clientWidth) - ele.scrollLeft > scroll) {
  //     this.CanScrollRight = true;
  //   }
  //   else {
  //     this.CanScrollRight = false;
  //   }
  //   ele.scrollLeft += scroll;
  // }

  // CheckScrollable(){
  //   debugger
  //   this.IsScrollable = false;
  //   this.CanScrollLeft = false;
  //   this.CanScrollRight = false;
  //   let timer = setInterval(() => {
  //     let ele = document.getElementById('product_content')
  //     if (ele != null && ele != undefined) {
  //       const hasScrollableContent = ele.scrollWidth > ele.clientWidth;
  //       this.IsScrollable = hasScrollableContent;
  //       this.CanScrollRight = this.IsScrollable;    
  //     }
  //     if (ele.clientWidth > 0) {
  //       clearInterval(timer);
  //     }
  //   },50)
  // }

}

