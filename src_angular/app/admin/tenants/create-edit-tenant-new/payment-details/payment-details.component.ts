import { InputValidationService } from '@account/shared/input-validation.service';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddOn, AddonSubscriptionDto, AvailableAddonModulesDto, EditionList, EditionServiceProxy, ModulePricingDto, PackageDetailsInputDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent extends AppComponentBase implements OnInit {
  // @Input() SelectedPackagesData: EditionProductData[] = [];
  @Input()TenantId = 0;
  

  SelectedPackages: SelectedPackagesAndAddons[] = new Array<SelectedPackagesAndAddons>();
  isPaymentRequired: boolean;
  // selectedEditionPricingDays = 0;
  submitted: boolean = false;
  dataFetched: boolean = true;
  PackagesDataForEdit: PackageDetailsInputDto[];
  constructor(injector: Injector,private _editionService: EditionServiceProxy,public _validationService:InputValidationService) {
    super(injector)
  }

  ngOnInit(): void {
    // this.selectedEditionPricing = null;
    // this.selectedAddonPricing = [];
    this.isPaymentRequired = false;
  }
  
  GetPackageAndAddonDetails(data:EditionProductData[]){
    this.dataFetched = false;
    this.SelectedPackages = new Array<SelectedPackagesAndAddons>();
    if(data != null && data != undefined && data.length > 0){
      let prodIndex = 0;
      data.forEach(pkg => {
        this._editionService.getProductWithEdition(pkg.ProductId, 0 ,pkg.EditionId, false, true)
        .toPromise().then(async result => {
          let tempPackage = new SelectedPackagesAndAddons();
          if(result != null){
            tempPackage.SelectedEditionData = result[0].edition[0];
            tempPackage.ProductName = pkg.ProductName;
            if(tempPackage.SelectedEditionData.addons != null && tempPackage.SelectedEditionData.addons != undefined
              && pkg.SelectedAddons != null && pkg.SelectedAddons != undefined && pkg.SelectedAddons.length > 0)
            {
              tempPackage.SelectedAddonsData = new Array<AddOn>();
              pkg.SelectedAddons.forEach(ad =>{
                let adn = tempPackage.SelectedEditionData.addons.filter(obj => obj.addOnId == ad.AddonId);
                if(adn != null && adn != undefined && adn.length > 0)
                {
                  tempPackage.SelectedAddonsData.push(adn[0]);
                }
              });
          }
          }
          await this.SelectedPackages.push(tempPackage);
          let subscribedPkgIndex = -1;
          if(this.PackagesDataForEdit != null && this.PackagesDataForEdit != undefined)          // if admin Edit any Tenant
          {
            subscribedPkgIndex = this.PackagesDataForEdit.findIndex(f => f.editionId == tempPackage.SelectedEditionData.editionID);
            if(subscribedPkgIndex != -1)
            {
            await this.SetSubscribedPackagesPricing(subscribedPkgIndex, prodIndex);
            }
          }
          await this.SetSelectedPricingData(prodIndex, subscribedPkgIndex);
          prodIndex++;
          if(prodIndex == data.length){
            this.dataFetched = true;
          }
        });
      });
    }
    else{
      this.dataFetched = true;
    }
  }
  
  SetSelectedPricingData(prodIndex, subscribedPkgIndex = -1) {
    if (this.SelectedPackages[prodIndex].SelectedEditionData != null && this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype != null
      && this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype != undefined && this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype.length > 0)
      {
        let i = 0;
        if(subscribedPkgIndex >= 0){
          let j = this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype.findIndex(f => f.pricingTypeID == this.PackagesDataForEdit[subscribedPkgIndex].pricingTypeId)
          if(j >= 0) i = j;
        }
        this.SelectedPackages[prodIndex].selectedEditionPricing = {
        "EditioName": this.SelectedPackages[prodIndex].SelectedEditionData.editionName,
        "PricingTypeId": this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].pricingTypeID,
        "Price": this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].price,
        "Discount": this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].discount,
        "IsSubscribed": this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i]["IsSubscribed"]
      };
      this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i]["selected"] = true;
      this.isPaymentRequired = true;
      this.SelectedPackages[prodIndex].selectedEditionPricingDays = this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].days;
    }
    if (this.SelectedPackages[prodIndex].SelectedAddonsData != null && this.SelectedPackages[prodIndex].SelectedAddonsData.length > 0) {
      this.SelectedPackages[prodIndex].SelectedAddonsData.forEach(addon => {
        if (addon != null && addon.addonPrice != null && addon.addonPrice != undefined && addon.addonPrice.length > 0) 
        {

          let i = 0;
          if(subscribedPkgIndex >= 0 && this.PackagesDataForEdit[subscribedPkgIndex].addonSubscription != null && this.PackagesDataForEdit[subscribedPkgIndex].addonSubscription != undefined)
          {
            let j = this.PackagesDataForEdit[subscribedPkgIndex].addonSubscription.findIndex(f => f.addonId == addon.addOnId && f.pricingTypeId > 0);
            if(j >= 0){
              i = addon.addonPrice.findIndex(f => f.pricingTypeID == this.PackagesDataForEdit[subscribedPkgIndex].addonSubscription[j].pricingTypeId);
            }  
          }
          this.SelectedPackages[prodIndex].selectedAddonPricing.push({
            "AddonId": addon.addOnId, "AddonName": addon.addOnName,
            "PricingTypeId": addon.addonPrice[i].pricingTypeID,
            "Discount": addon.addonPrice[i].discount,
            "Price": addon.addonPrice[i].price - (addon.addonPrice[i].price * addon.addonPrice[i].discount) / 100,
            "IsSubscribed" : addon.addonPrice[i]["IsSubscribed"]
          });
          addon.addonPrice[i]["selected"] = true;
          this.isPaymentRequired = true;
        }
      })
    }
  }
  SetSubscribedPackagesPricing(index, prodIndex)
  {
    // update Edition pricing and Discount
    if(this.PackagesDataForEdit[index].pricingTypeId > 0 && this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype != null
      && this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype != undefined){
        this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype.forEach( f =>{
          if(f.pricingTypeID == this.PackagesDataForEdit[index].pricingTypeId)
          {
            f.price = this.PackagesDataForEdit[index].amount;
            f.discount = this.PackagesDataForEdit[index].discountPercentage;
            f["IsSubscribed"] = true;
          }
        })
    }
    // set subscribed addon pricing flag to manage price changes
    if(this.PackagesDataForEdit[index].addonSubscription != null && this.PackagesDataForEdit[index].addonSubscription != undefined)
    {
      this.PackagesDataForEdit[index].addonSubscription.forEach(adn =>
        {
          if(this.SelectedPackages[prodIndex].SelectedAddonsData != null && this.SelectedPackages[prodIndex].SelectedAddonsData != undefined)
          {
          let adonIndex = this.SelectedPackages[prodIndex].SelectedAddonsData.findIndex(x => x.addOnId == adn.addonId);
          if(adonIndex != -1){
            if(this.SelectedPackages[prodIndex].SelectedAddonsData[adonIndex].addonPrice != null && this.SelectedPackages[prodIndex].SelectedAddonsData[adonIndex].addonPrice != undefined)
            {
              let addonPriceInde = this.SelectedPackages[prodIndex].SelectedAddonsData[adonIndex].addonPrice.findIndex(x => x.pricingTypeID == adn.pricingTypeId)
              {
                if(addonPriceInde != -1){
                  this.SelectedPackages[prodIndex].SelectedAddonsData[adonIndex].addonPrice[addonPriceInde]["IsSubscribed"] = true;
                }
              }
            }
          }
        }
        });
      
    }
  }
  EditionPriceChange(prodIndex, pricing, index) {
    this.SelectedPackages[prodIndex].selectedEditionPricing["Price"] = pricing.price;
    this.SelectedPackages[prodIndex].selectedEditionPricing["Discount"] = pricing.discount;
    this.SelectedPackages[prodIndex].selectedEditionPricing["PricingTypeId"] = pricing.pricingTypeID;
    this.SelectedPackages[prodIndex].selectedEditionPricing["IsSubscribed"] = pricing["IsSubscribed"];
    for (let i = 0; i < this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype.length; i++) {
      this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i]["selected"] = false;
      if (i == index) {
        this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i]["selected"] = true;
        if (this.SelectedPackages[prodIndex].selectedEditionPricingDays > this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].days) {
          this.ResetAddonPricingOnEditionPricingChange(prodIndex, this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].pricingTypeID);
        }
        this.SelectedPackages[prodIndex].selectedEditionPricingDays = this.SelectedPackages[prodIndex].SelectedEditionData.pricingtype[i].days;
      }
    }
  }
  AddonPriceChange(prodIndex, addon, addonIndex, index) {
    let pricingIndex = this.SelectedPackages[prodIndex].selectedAddonPricing.findIndex(x => x["AddonId"] == addon.addOnId);
    for (let i = 0; i < this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice.length; i++) {
      this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i]["selected"] = false;      
      // if(this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["PricingTypeId"] != addon.addonPrice[index].pricingTypeID)
      // {
      //   this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex]["IsSubscribed"] = false;
      //   this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["IsSubscribed"] = false;
      // }
      if (i == index) {
        this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i]["selected"] = true;
        this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["PricingTypeId"] = this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i].pricingTypeID;
        this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["Price"] = this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i].price;// - (this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i].price * this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i].discount) / 100;
        this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["Discount"] = this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i].discount;
        this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["IsSubscribed"] = this.SelectedPackages[prodIndex].SelectedAddonsData[addonIndex].addonPrice[i]["IsSubscribed"];
      }
    }
  }
  ResetAddonPricingOnEditionPricingChange(prodIndex,editionPricingTypeId) {
    if (this.SelectedPackages[prodIndex].SelectedAddonsData != null && this.SelectedPackages[prodIndex].SelectedAddonsData.length > 0) {
      this.SelectedPackages[prodIndex].SelectedAddonsData.forEach(addon => {
        if (addon != null && addon.addonPrice != null && addon.addonPrice != undefined && addon.addonPrice.length > 0) {
          let pricingIndex = this.SelectedPackages[prodIndex].selectedAddonPricing.findIndex(x => x["AddonId"] == addon.addOnId);
          addon.addonPrice.forEach(price => {
            if (price.pricingTypeID == editionPricingTypeId) {
              price["selected"] = true;
              this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["PricingTypeId"] = price.pricingTypeID;
              this.SelectedPackages[prodIndex].selectedAddonPricing[pricingIndex]["Price"] = price.price;// - (price.price * price.discount) / 100;
            }
            else {
              price["selected"] = false;
            }
          })
          this.isPaymentRequired = true;
        }
      })
    }
  }
  CalculateTotal(pkgIndex1) {
    let total = 0;
    for(let i = 0; i < this.SelectedPackages.length; i++){
    if (this.SelectedPackages[i].selectedEditionPricing != null && this.SelectedPackages[i].selectedEditionPricing["Price"] > 0 && !this.SelectedPackages[i].selectedEditionPricing["IsSubscribed"]) {
      total += this.SelectedPackages[i].selectedEditionPricing["Price"] - (this.SelectedPackages[i].selectedEditionPricing["Price"]*this.SelectedPackages[i].selectedEditionPricing["Discount"])/100;
    }
    if (this.SelectedPackages[i].selectedAddonPricing != null && this.SelectedPackages[i].selectedAddonPricing.length > 0) {
      this.SelectedPackages[i].selectedAddonPricing.forEach(x => {
        if(!x["IsSubscribed"]){
        total += x["Price"] - (x["Price"]*x["Discount"])/100;
        }
      });
    }
  }
    return total;
  }
  CheckValidData():boolean
  {
    if(!(this.SelectedPackages != null && this.SelectedPackages != undefined && this.SelectedPackages.length > 0))
    {
      return false;
    }
    return true;
  }
  GetDataToInsert(editionId){
    let pkgData:PackageDetailsInputDto = new PackageDetailsInputDto();;
    let pkgIndex = this.SelectedPackages.findIndex(obj => obj.SelectedEditionData.editionID == editionId);
    if(pkgIndex != -1){
      pkgData.pricingTypeId = this.SelectedPackages[pkgIndex].selectedEditionPricing != null ? this.SelectedPackages[pkgIndex].selectedEditionPricing["PricingTypeId"] : null;
      pkgData.amount =  this.SelectedPackages[pkgIndex].selectedEditionPricing != null ? this.SelectedPackages[pkgIndex].selectedEditionPricing["Price"] : 0; //this.CalculateTotal(pkgIndex);
      pkgData.discountPercentage =  this.SelectedPackages[pkgIndex].selectedEditionPricing != null ? this.SelectedPackages[pkgIndex].selectedEditionPricing["Discount"] : 0; 
      pkgData.paymentType = this.SelectedPackages[pkgIndex].selectedEditionPricing != null ? SubscriptionStartType.Paid : SubscriptionStartType.Free;
      pkgData.paymentModeCode = "WALLET";
      pkgData.paymentDone = true;
    if (this.SelectedPackages[pkgIndex].SelectedAddonsData != null && this.SelectedPackages[pkgIndex].SelectedAddonsData.length > 0) {
      pkgData.addonSubscription = new Array<AddonSubscriptionDto>();
      this.SelectedPackages[pkgIndex].SelectedAddonsData.forEach(addon => {
        let addonPriceIndex = this.SelectedPackages[pkgIndex].selectedAddonPricing.findIndex(x => x["AddonId"] == addon.addOnId);
        let data = new AddonSubscriptionDto();
        data.addonId = addon.addOnId;
        data.pricingTypeId = addonPriceIndex < 0 ? null : this.SelectedPackages[pkgIndex].selectedAddonPricing[addonPriceIndex]["PricingTypeId"];
        data.amount = addonPriceIndex < 0 ? null : this.SelectedPackages[pkgIndex].selectedAddonPricing[addonPriceIndex]["Price"];
        data.paymentType = addonPriceIndex < 0 ? SubscriptionStartType.Free : SubscriptionStartType.Paid
        pkgData.addonSubscription.push(data);
      })
    }
  }
      return pkgData;
  }
}

export class SelectedPackagesAndAddons{
  SelectedEditionData: EditionList;
  SelectedAddonsData: AddOn[];
  selectedEditionPricing;
  selectedAddonPricing = [];
  ProductName;
  selectedEditionPricingDays = 0;
  IsSubscribed: boolean = false
}

export class EditionProductData {
  ProductId?: number;
  EditionId?: number;
  ApproachId?: number;
  ProductName: string;
  EditionName: string;
  IsFree: boolean;
  ModulesFetched: boolean;
  SelectedAddons: SelectedAddons[] = [];
  EditionPricing : ModulePricingDto[] = [];
  AddonList: AvailableAddonModulesDto[] = [];
  IsSubscribed: boolean = false
}
export class SelectedAddons{
  AddonId:number;
  AddonName: string;
  IsSubscribed: boolean = false;
}