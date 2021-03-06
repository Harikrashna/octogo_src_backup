import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddOn, DashboardCustomizationServiceProxy, EditionList, EditionServiceProxy, SubscribedStandAloneAddonDto, TenantEditionAddonDto } from '@shared/service-proxies/service-proxies';
import { PackageDetailedInformationComponent } from '../package-detailed-information/package-detailed-information.component';

@Component({
  selector: 'app-subscribed-products-details',
  templateUrl: './subscribed-products-details.component.html',
  styleUrls: ['./subscribed-products-details.component.css']
})
export class SubscribedProductsDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild('packageDetailedInformation') packageDetailedInformation: PackageDetailedInformationComponent
  @Input() ForDashboard = false;
  @Input() selectedEditionId = 0;

  productDetailsList: TenantEditionAddonDto[]=[];
  StandAloneAddonList: SubscribedStandAloneAddonDto[]=[];
  showDetailedInformation: boolean = false;
  showEditionInformation:boolean = true;
  scrollLength = 500;
  IsScrollable: boolean = false;
  CanScrollLeft: boolean = false;
  CanScrollRight: boolean = false;
  SelectedPackage:TenantEditionAddonDto = null;
  loading:boolean;
  SeletedProductIndex = 0
  dataFetched: boolean = false;
  IsAddonExtend: boolean = false;
  selectedEditionData: EditionList;
  selectedAddonsData: AddOn[];
  constructor( injector: Injector,  private _dashboardService: DashboardCustomizationServiceProxy,private _editionService: EditionServiceProxy) { 
    super(injector);
  }
  ngOnInit() {
  this.productDetailsList = new Array<TenantEditionAddonDto>();
  this.StandAloneAddonList = new Array<SubscribedStandAloneAddonDto>()
  this.loading = true;
  this.dataFetched = false;
    this._dashboardService.getTenantEditionAddonDetailsByTenantId(this.appSession.tenantId)
    .subscribe(result => {
      this.loading = false;
      this.dataFetched = true;
      if(result != null){
         this.productDetailsList = result.tenantEditionAddon;
         debugger
         this.StandAloneAddonList = result.standAloneAddon;
         debugger
        //  this.productDetailsList.push(result[0]);
        //  this.CheckScrollable();
        if(!this.ForDashboard){
          if(this.selectedEditionId > 0) {
            this.SeletedProductIndex = this.productDetailsList.findIndex(x => x.editionId == this.selectedEditionId)
          }
        this.ShowPackageDetails(this.SeletedProductIndex);
        }
      }
    });
  }
  ShowPackageDetails(prodIndex) {
    this.SeletedProductIndex = prodIndex < 0 ? 0 : prodIndex;
    this.showDetailedInformation = true;
    this.SelectedPackage = this.productDetailsList[prodIndex];
    let timer = setInterval(() => {
      if (this.packageDetailedInformation != null && this.packageDetailedInformation != undefined) {
        this.packageDetailedInformation.EditionDetailedInformation = null;
        this.packageDetailedInformation.availableAddonList = null;
        if(this.SelectedPackage != null && this.SelectedPackage != undefined){
        this.packageDetailedInformation.Show(this.SelectedPackage.editionId, this.SelectedPackage);
        }
        clearInterval(timer)
      }
    }, 50)
  }
  upgradeClicked() {
    this.showEditionInformation = false;
    this.SeletedProductIndex = -1;
   }
   ShowSubscribedProducts(){
    this.showEditionInformation = true;
    this.ShowPackageDetails(0);
   }
   checkExpiryTime(remainingDays) {
     if(remainingDays > 0){
      if (remainingDays <= 7) {
        return true
      }
     }
    return false;
  }
  BackToPackageList(){
    this.IsAddonExtend = false;
  }
  ExtendAddonSubscription(addon)
  {
   this.loading = true;
   this.selectedAddonsData = [];
   this._editionService.getProductWithEdition(this.SelectedPackage.productId, 0 ,this.SelectedPackage.editionId, false, true)
   .subscribe(result => {
     this.loading = false;
     if(result != null){
       this.selectedEditionData = result[0].edition[0];
       let adn = this.selectedEditionData.addons.filter(obj => obj.addOnName == addon.addonName);
       if(adn != null && adn != undefined && adn.length > 0)
       {
        this.IsAddonExtend = true;
        this.selectedAddonsData.push(adn[0]);
       }
     }
   });
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

