import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddOn, AddonSubscriptionDto, CreatePaymentNewDto, EditionAddonSubscriptionInputDto, EditionList, PaymentServiceProxy, SubscriptionServiceProxy, SubscriptionStartType } from '@shared/service-proxies/service-proxies';
import { AbpSessionService } from 'abp-ng2-module';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-package-addons-cart',
  templateUrl: './package-addons-cart.component.html',
  styleUrls: ['./package-addons-cart.component.css']
})
export class PackageAddonsCartComponent extends AppComponentBase  implements OnInit {
  @Input() SelectedEditionData: EditionList;
  @Input() SelectedAddonsData: AddOn[];
  @Input() ProductName;

  selectedEditionPricing;
  selectedAddonPricing = [];
  isPaymentRequired:boolean;
  selectedEditionPricingDays = 0;
  submitted: boolean = false;
  constructor(injector: Injector,private _router: Router, 
    private _subscriptionAppService: SubscriptionServiceProxy) {
      super(injector)
     }

  ngOnInit(): void {
    this.selectedEditionPricing = null;
    this.selectedAddonPricing = [];
    this.isPaymentRequired = false;
    this.SetSelectedPricingData();
  }
  SetSelectedPricingData(){
    if(this.SelectedEditionData != null && this.SelectedEditionData.pricingtype != null
      && this.SelectedEditionData.pricingtype != undefined && this.SelectedEditionData.pricingtype.length > 0 ){
      this.selectedEditionPricing = {"EditioName":this.SelectedEditionData.editionName,
          "PricingTypeId":this.SelectedEditionData.pricingtype[0].pricingTypeID,
          "Price": this.SelectedEditionData.pricingtype[0].price - (this.SelectedEditionData.pricingtype[0].price * this.SelectedEditionData.pricingtype[0].discount)/100};
      this.SelectedEditionData.pricingtype[0]["selected"]=true;
      this.isPaymentRequired = true;
      this.selectedEditionPricingDays = this.SelectedEditionData.pricingtype[0].days;
    }
    if(this.SelectedAddonsData != null && this.SelectedAddonsData.length > 0 ){
      this.SelectedAddonsData.forEach(addon =>{
        if(addon != null && addon.addonPrice != null && addon.addonPrice !=undefined && addon.addonPrice.length > 0 ){
          this.selectedAddonPricing.push({"AddonId":addon.addOnId,"AddonName":addon.addOnName,
            "PricingTypeId":addon.addonPrice[0].pricingTypeID,
            "Price":addon.addonPrice[0].price - (addon.addonPrice[0].price * addon.addonPrice[0].discount)/100});
            addon.addonPrice[0]["selected"]=true;
          this.isPaymentRequired = true;
        }
      })
    }
  }
  EditionPriceChange(pricing, index){
    this.selectedEditionPricing["Price"] = pricing.price - (pricing.price * pricing.discount)/100;
    this.selectedEditionPricing["PricingTypeId"] = pricing.pricingTypeID;
    for(let i = 0; i < this.SelectedEditionData.pricingtype.length; i++){
      this.SelectedEditionData.pricingtype[i]["selected"]=false;
      if(i == index){
      this.SelectedEditionData.pricingtype[i]["selected"]=true;
      if(this.selectedEditionPricingDays > this.SelectedEditionData.pricingtype[i].days){
        this.ResetAddonPricingOnEditionPricingChange(this.SelectedEditionData.pricingtype[i].pricingTypeID);
      }
      this.selectedEditionPricingDays = this.SelectedEditionData.pricingtype[i].days;
      }
    }
  }
  AddonPriceChange(addon,addonIndex, index){
    let pricingIndex = this.selectedAddonPricing.findIndex(x => x["AddonId"] == addon.addOnId);
    for(let i = 0; i < this.SelectedAddonsData[addonIndex].addonPrice.length; i++){
      this.SelectedAddonsData[addonIndex].addonPrice[i]["selected"]=false;
      if(i == index){
        this.SelectedAddonsData[addonIndex].addonPrice[i]["selected"]=true;
        this.selectedAddonPricing[pricingIndex]["Price"] = this.SelectedAddonsData[addonIndex].addonPrice[i].price - (this.SelectedAddonsData[addonIndex].addonPrice[i].price * this.SelectedAddonsData[addonIndex].addonPrice[i].discount)/100;
      }
    }
  }
  ResetAddonPricingOnEditionPricingChange(editionPricingTypeId) {
    if(this.SelectedAddonsData != null && this.SelectedAddonsData.length > 0 ){
      this.SelectedAddonsData.forEach(addon =>{
        if(addon != null && addon.addonPrice != null && addon.addonPrice !=undefined && addon.addonPrice.length > 0 ){
          let pricingIndex = this.selectedAddonPricing.findIndex(x => x["AddonId"] == addon.addOnId);
          addon.addonPrice.forEach(price => {
            if(price.pricingTypeID == editionPricingTypeId){
              price["selected"]=true;
              this.selectedAddonPricing[pricingIndex]["PricingTypeId"] = price.pricingTypeID;
              this.selectedAddonPricing[pricingIndex]["Price"] = price.price - (price.price * price.discount)/100;
            }
            else{
              price["selected"]=false;
            }
          })
          this.isPaymentRequired = true;
        }
      })
    }
  }
  CalculateTotal(){
    let total = 0;
    if(this.selectedEditionPricing != null && this.selectedEditionPricing["Price"] > 0){
      total += this.selectedEditionPricing["Price"];
    }
    if(this.selectedAddonPricing != null && this.selectedAddonPricing.length > 0){
      this.selectedAddonPricing.forEach(x => {
        total += x["Price"]
      });
    }
    return total;
  }
  CreatePayment(PaymentModeCode){
  this.Checkout(PaymentModeCode);
  }
  Checkout(PaymentModeCode?) {
    // let input = {} as CreatePaymentDto;
    let input = {} as EditionAddonSubscriptionInputDto;
    input .tenantId = this.appSession.tenant.id;
    input.editionId = this.SelectedEditionData.editionID;
    input.pricingTypeId = this.selectedEditionPricing != null ?this.selectedEditionPricing["PricingTypeId"] : null;
    input.amount = this.CalculateTotal();
    input.paymentModeCode = PaymentModeCode;
    input.paymentType = this.selectedEditionPricing != null ? SubscriptionStartType.Paid :SubscriptionStartType.Free;
    if(this.SelectedAddonsData != null && this.SelectedAddonsData.length > 0){
      input.addonSubscription = new Array<AddonSubscriptionDto>();
      this.SelectedAddonsData.forEach(addon =>{
        let addonPriceIndex = this.selectedAddonPricing.findIndex(x => x["AddonId"] == addon.addOnId);
        let data = new AddonSubscriptionDto();
        data.addonId = addon.addOnId;
        data.pricingTypeId = addonPriceIndex < 0 ? null : this.selectedAddonPricing[addonPriceIndex]["PricingTypeId"];
        data.amount = addonPriceIndex < 0 ? null : this.selectedAddonPricing[addonPriceIndex]["Price"];
        data.paymentModeCode = addonPriceIndex < 0 ? null : PaymentModeCode;
        data.paymentType = addonPriceIndex < 0 ? SubscriptionStartType.Free :SubscriptionStartType.Paid
        input.addonSubscription.push(data);
      })
    }
    this.submitted = true;
    this._subscriptionAppService.insertEditionAddonSubscription(input)
        .pipe(finalize(() => {  this.submitted = false; }))
        .subscribe((paymentId: number) => {
          location.reload();
        });
}
}
