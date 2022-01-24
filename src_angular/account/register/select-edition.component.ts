import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EditionPaymentType, EditionServiceProxy, EditionsSelectOutput, ProductWithEditionDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'app-select-edition',
     templateUrl: './select-edition.component.html',
     styleUrls: ['./select-edition.component.less'],
    animations: [accountModuleAnimation(),
      trigger('openClose', [
        // ...
        state('open', style({
         
          opacity: 1,
          // backgroundColor: 'yellow'
        })),
        state('closed', style({
         
          opacity: 0.8,
         // backgroundColor: 'blue'
        })),
        transition('open => closed', [animate('2800ms ease-out')]),
        transition('closed => open', [animate('2800ms ease-in')])
      ]),]
})
export class SelectEditionComponent extends AppComponentBase implements OnInit {
  @Input() ProductWithEditionList:ProductWithEditionDto[]
  loading: boolean = true;
  editionsSelectOutput: EditionsSelectOutput = new EditionsSelectOutput();
  isUserLoggedIn: boolean = false;
  discountedPrice:any;
  expanded:boolean=false;
  currentIndex=null;
  productName=null;
  isAddonCollapsed = false;
  addonIndex = null;

  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
  editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];

  constructor(private injector:Injector, private _editionService: EditionServiceProxy,
    private _router: Router) {
    super(injector);
   }

  ngOnInit(): void {
    if(this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0){
      this.isUserLoggedIn = true;
    }
    if(this.ProductWithEditionList == null || this.ProductWithEditionList == undefined){
      this.spinnerService.show();
    this._editionService.getProductWithEdition().subscribe(result=>{
      this.spinnerService.hide();
      this.ProductWithEditionList=result;
    })
    }
  }
  isFree(pricingData?): boolean{
    if(pricingData != null && pricingData.length > 0){
      return false;
    }
    return true;
  }

expandedTrue(i,product){
  
  this.currentIndex=i;
  this.productName=product;
  this.expanded=true;
}

expandedFalse(i,product){
  this.currentIndex=null;
  this.productName=product;
  this.expanded=false;
  this.currentIndex=null
}
getFilteredEditions(edition, type){
  if(edition != null){
    if(type=="FREE"){
      return edition.filter(obj => obj.pricingtype == null || obj.pricingtype.length == 0)
    }
    else if(type=="PAID"){
      return edition.filter(obj => obj.pricingtype != null && obj.pricingtype.length > 0)
    }
  }
  else{
    return [];
  }
}

DicountedPriceInput(item) {
 let savingPrice=(item.price * item.discount) /100;
 this.discountedPrice=item.price-savingPrice;
 console.log(this.discountedPrice);  
}
upgrade(upgradeEdition, editionPaymentType: EditionPaymentType): void {
    this._router.navigate(['/account/upgrade'], { queryParams: { upgradeEditionId: upgradeEdition.editionID, editionPaymentType: editionPaymentType } });
}
expandAddons(index){
  this.addonIndex = index;
    this.isAddonCollapsed = !this.isAddonCollapsed;
  }
}

export class expanded{
  expand:false;
  index:null;
}

const roundTo = function (num: number, places: number) {
  const factor = 10 ** places;
  return Math.round(num * factor) / factor;
};

























































// import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
// import { Router } from '@angular/router';
// import { accountModuleAnimation } from '@shared/animations/routerTransition';
// import { AppComponentBase } from '@shared/common/app-component-base';
// import {
//     EditionSelectDto,
//     EditionWithFeaturesDto,
//     EditionsSelectOutput,
//     FlatFeatureSelectDto,
//     TenantRegistrationServiceProxy,
//     EditionPaymentType,
//     SubscriptionStartType
// } from '@shared/service-proxies/service-proxies';
// import { filter as _filter } from 'lodash-es';
// import { EditionHelperService } from '@account/payment/edition-helper.service';

// @Component({
//     templateUrl: './select-edition.component.html',
//     styleUrls: ['./select-edition.component.less'],
//     encapsulation: ViewEncapsulation.None,
//     animations: [accountModuleAnimation()]
// })
// export class SelectEditionComponent extends AppComponentBase implements OnInit {

//     editionsSelectOutput: EditionsSelectOutput = new EditionsSelectOutput();
//     isUserLoggedIn = false;
//     isSetted = false;
//     editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
//     subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
//     /*you can change your edition icons order within editionIcons variable */
//     editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];

//     constructor(
//         injector: Injector,
//         private _tenantRegistrationService: TenantRegistrationServiceProxy,
//         private _editionHelperService: EditionHelperService,
//         private _router: Router
//     ) {
//         super(injector);
//     }

//     ngOnInit() {
//         this.isUserLoggedIn = abp.session.userId > 0;
//         this.spinnerService.show();
//         this._tenantRegistrationService.getEditionsForSelect()
//             .subscribe((result) => {
//                 this.spinnerService.hide();
//                 this.editionsSelectOutput = result;

//                 if (!this.editionsSelectOutput.editionsWithFeatures || this.editionsSelectOutput.editionsWithFeatures.length <= 0) {
//                     this._router.navigate(['/account/register-tenant']);
//                 }
//             });
//     }

//     isFree(edition: EditionSelectDto): boolean {
//         return this._editionHelperService.isEditionFree(edition);
//     }

//     isTrueFalseFeature(feature: FlatFeatureSelectDto): boolean {
//         return feature.inputType.name === 'CHECKBOX';
//     }

//     featureEnabledForEdition(feature: FlatFeatureSelectDto, edition: EditionWithFeaturesDto): boolean {
//         const featureValues = _filter(edition.featureValues, { name: feature.name });
//         if (!featureValues || featureValues.length <= 0) {
//             return false;
//         }

//         const featureValue = featureValues[0];
//         return featureValue.value.toLowerCase() === 'true';
//     }

//     getFeatureValueForEdition(feature: FlatFeatureSelectDto, edition: EditionWithFeaturesDto): string {
//         const featureValues = _filter(edition.featureValues, { name: feature.name });
//         if (!featureValues || featureValues.length <= 0) {
//             return '';
//         }

//         const featureValue = featureValues[0];
//         return featureValue.value;
//     }

//     upgrade(upgradeEdition: EditionSelectDto, editionPaymentType: EditionPaymentType): void {
//         this._router.navigate(['/account/upgrade'], { queryParams: { upgradeEditionId: upgradeEdition.id, editionPaymentType: editionPaymentType } });
//     }
// }
