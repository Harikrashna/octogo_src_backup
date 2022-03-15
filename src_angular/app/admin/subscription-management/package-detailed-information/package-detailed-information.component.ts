import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddOn, AvailableAddonModulesDto, DashboardCustomizationServiceProxy, EditionAddonModules, EditionList, EditionServiceProxy, PricingDataDto, PricingType, TenantEditionAddonDto, TenantEditionAddonModulesDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-package-detailed-information',
  templateUrl: './package-detailed-information.component.html',
  styleUrls: ['./package-detailed-information.component.css']
})
export class PackageDetailedInformationComponent extends AppComponentBase implements OnInit {

  @Input() PackageDetails:TenantEditionAddonDto;
  @Output() backClicked = new EventEmitter();
  @Output() actionClicked = new EventEmitter();

  IsExtend: boolean = false;
  IsUpgrade: boolean = false;
  IsAddonBuy: boolean = false;
  IsAddonExtend: boolean = false;
  dataFetched: boolean = false;
  IsBackToPackageDetails: boolean = true;
  EditionDetailedInformation : TenantEditionAddonModulesDto[];
  availableAddonList : AvailableAddonModulesDto[];
  EditionId;
  selectedEditionData: EditionList;
  selectedAddonsData: AddOn[];
  selectedProductName;
  pageHeadding = '';
  

  constructor(private _dsashboardCustomizationService: DashboardCustomizationServiceProxy,
     private _editionService: EditionServiceProxy, injector: Injector) {
      super(injector)
      }

  ngOnInit(): void {
    if(this.PackageDetails != null && this.PackageDetails != undefined){
    this.EditionId = this.PackageDetails.editionId;
    }
  }
  Show(editionId,packageDetails: TenantEditionAddonDto){
    this.EditionId = packageDetails.editionId;
    this.PackageDetails = packageDetails;
    this.GetPackageDetailedInformation();
    this.GetAvailableAddonBySubscribedEditionId();
  }
GetPackageDetailedInformation()
{
  if(this.PackageDetails.editionId > 0){
    this.dataFetched = false;
    this.EditionDetailedInformation = new Array<TenantEditionAddonModulesDto>();
    this._dsashboardCustomizationService.getTenantEditionAddonModuleDetails(this.PackageDetails.editionId )
    .subscribe(result => {
      this.dataFetched = true;
      if(result != null){
         this.EditionDetailedInformation = result;
         if(this.EditionDetailedInformation != null && this.EditionDetailedInformation.length > 0)
         {
          this.EditionDetailedInformation[0].module = this.MergeModuleDuplicacy(this.EditionDetailedInformation[0].module);
         }
        //  this.CheckScrollable();
      }
    });
  }
}
MergeModuleDuplicacy(modules: EditionAddonModules[]):EditionAddonModules[]
{
  if(modules != null && modules != undefined && modules.length > 0)
  {
    modules.forEach(module =>
      {
        if(module.subModule != null && module.subModule != undefined && module.subModule.length > 0)
        {
          for(let subModIndex = 0; subModIndex < module.subModule.length; subModIndex++)
          {
            let subModules = module.subModule.filter(d=> d.moduleName == module.subModule[subModIndex].moduleName);
            if(subModules != null && subModules.length > 1)   // if Sub Modules duplicate
            {
              for(let i = 1; i < subModules.length; i++)
              {
                if(subModules[i].subModule != null && subModules[i].subModule != undefined && subModules[i].subModule.length > 0)
                {
                  module.subModule[subModIndex].subModule.push(...subModules[i].subModule);
                }
              }
              if(subModIndex < module.subModule.length - 1)
              {
                for(let j = subModIndex+1; j < module.subModule.length; j++)
                {
                  if(module.subModule[j].moduleName == module.subModule[subModIndex].moduleName)
                  {
                    module.subModule.splice(j, 1);
                  }
                }
              }
            }
          }
        }
      });
      return modules;
  }
  return [];
}
GetAvailableAddonBySubscribedEditionId(): void {
  this.availableAddonList = new Array<AvailableAddonModulesDto>();
  this._editionService.getAvailableAddonBySubscribedEditionId(this.PackageDetails.editionId)
  .subscribe(result => {
    this.availableAddonList = result;
  })
}
checkProcess(process){
  if(process == false){
    return true;
  }
  return false;
}
checkExpiryTime(remainingDays){
  if(remainingDays <= 7){
    return true
  }
      return false;
    }

 BackToPackageDetails(){
  this.IsUpgrade = false;
  this.IsExtend = false;
  this.IsAddonBuy = false;
  this.IsAddonExtend = false;
  this.selectedEditionData = null;
  this.selectedAddonsData = [];
  this.backClicked.emit(null);
 }
 ExtendPackage(editionId, productName){
  this.dataFetched = false;
  this._editionService.getProductWithEdition(this.PackageDetails.productId, 0 ,editionId, false)
  .subscribe(result => {
    this.dataFetched = true;
    if(result != null){
      this.selectedEditionData = result[0].edition[0];
      this.selectedProductName = productName;
      this.IsExtend = true;
      this.actionClicked.emit(true);
    }
  });
 }

 UpgradePackage(){
  this.IsUpgrade = true;
  this.actionClicked.emit(true);
 }
 upgradeClickedOutput(event){
 this.IsBackToPackageDetails = !event;
 this.actionClicked.emit(true);
 }
 SubscribeAddon(addon: AvailableAddonModulesDto)
 {
  this.dataFetched = false;
  this.selectedAddonsData = [];
  this._editionService.getProductWithEdition(this.PackageDetails.productId, 0 ,addon.editionId, false)
  .subscribe(result => {
    this.dataFetched = true;
    if(result != null){
      this.IsAddonBuy = true;
      this.pageHeadding = this.l("SubscribeAddon");
      this.selectedEditionData = result[0].edition[0];
      let adn = this.selectedEditionData.addons.filter(obj => obj.addOnId == addon.addonId);
      if(adn != null && adn != undefined && adn.length > 0)
      {
        // pop pricing data of Addon that more then remaining days of Package subscription
        if(adn[0].addonPrice != null && adn[0].addonPrice.length > 0 &&  this.PackageDetails.endDate != null){
          adn[0].addonPrice = adn[0].addonPrice.filter( x=> x.days < this.PackageDetails.remainingDays)
          if(adn[0].addonPrice != null && adn[0].addonPrice.length > 0){
            this.selectedAddonsData.push(adn[0]);
          }
          else{
            this.notify.warn("PleaseExtendPackageBeforeAddonSubscription");
          }
        }
        else{
        this.selectedAddonsData.push(adn[0]);
        }
      }
      this.selectedProductName = this.PackageDetails.productName;
      this.actionClicked.emit(true);
    }
  });
 }
 ExtendAddonSubscription(addon)
 {
  this.dataFetched = false;
  this.selectedAddonsData = [];
  this._editionService.getProductWithEdition(this.PackageDetails.productId, 0 ,this.PackageDetails.editionId, false)
  .subscribe(result => {
    this.dataFetched = true;
    if(result != null){
      this.selectedEditionData = result[0].edition[0];
      let adn = this.selectedEditionData.addons.filter(obj => obj.addOnName == addon.addonName);
      if(adn != null && adn != undefined && adn.length > 0)
      {
        this.pageHeadding = this.l("ExtendAddon");
        // pop pricing data of Addon that more then remaining days of Package subscription
        if(adn[0].addonPrice != null && adn[0].addonPrice.length > 0 &&  this.PackageDetails.endDate != null){
          adn[0].addonPrice = adn[0].addonPrice.filter( x=> (addon.remainingDays + x.days) < this.PackageDetails.remainingDays)
          if(adn[0].addonPrice != null && adn[0].addonPrice.length > 0){
            this.IsAddonExtend = true;
            this.selectedAddonsData.push(adn[0]);
          }
          else{
            this.notify.warn("PleaseExtendPackageBeforeExtendAddon");
          }
        }
        else{
          this.IsAddonExtend = true;
        this.selectedAddonsData.push(adn[0]);
        }
      }
      this.selectedProductName = this.PackageDetails.productName;
      this.actionClicked.emit(true);
    }
  });
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
}
