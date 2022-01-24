import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EditionPaymentType, EditionServiceProxy, EditionsSelectOutput, ProductWithEditionDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-registered-user-edition-selection',
  templateUrl: './registered-user-edition-selection.component.html',
  styleUrls: ['./registered-user-edition-selection.component.css'],
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
export class RegisteredUserEditionSelectionComponent extends AppComponentBase implements OnInit {
  ProductWithEditionList:ProductWithEditionDto[]
  loading: boolean = true;
  editionsSelectOutput: EditionsSelectOutput = new EditionsSelectOutput();
  isUserLoggedIn: boolean = false;
  discountedPrice:any;
  expanded:boolean = false;
  currentIndex = null;
  productName = null;
  isAddonCollapsed = false;
  addonIndex = null;
  moduleIndex = null;
  showModules = null;
  isModuleCollapsed = false;
  isReadMore = true

 

  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
  editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];

  constructor(private injector:Injector, private _editionService: EditionServiceProxy,) {
    super(injector);
   }

  ngOnInit(): void {
    if(this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0){
      this.isUserLoggedIn = true;
    }
    this._editionService.getProductWithEdition().subscribe(result=>{
      this.loading=false;
      this.ProductWithEditionList=result;
      
    
      console.log(this.ProductWithEditionList);
      console.log(this.ProductWithEditionList[0].edition);
      this.showModules = 2;
    })

    // for(let i=0;i<this.ProductWithEditionList.length;i++){
    //   if(this.ProductWithEditionList[i]?.edition?.length > 0){
    //     console.log(this.ProductWithEditionList)
    //   }
    // }
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
  this.isAddonCollapsed = !this.isAddonCollapsed;
  this.isModuleCollapsed = ! this.isModuleCollapsed

  // alert(product+","+i);
}

expandedFalse(i,product){
  this.currentIndex=null;
  this.productName=product;
  this.expanded=false;
  this.currentIndex=null;
  this.isAddonCollapsed = !this.isAddonCollapsed;
  this.addonIndex = null;
  this.isModuleCollapsed = ! this.isModuleCollapsed
  this.moduleIndex = null;
  // alert(product+","+i);
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


expandAddons(index){
this.addonIndex = index;
  this.isAddonCollapsed = !this.isAddonCollapsed;
}

expandModules(index){
this.moduleIndex = index;
if(index >= 0){
  this.isModuleCollapsed = false;
}
else{
  this.isModuleCollapsed = true;
}
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


