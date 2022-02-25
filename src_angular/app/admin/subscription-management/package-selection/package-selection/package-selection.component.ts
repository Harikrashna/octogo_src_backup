import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddOn, EditionList, EditionPaymentType, EditionServiceProxy, EditionsSelectOutput, ProductWithEditionDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-package-selection',
  templateUrl: './package-selection.component.html',
  styleUrls: ['./package-selection.component.css']
})
export class PackageSelectionComponent extends AppComponentBase implements OnInit {
  @Input() ExcludeProductId;
  @Input() IncludeProductId;
  @Input() PackageId;
  @Input() IsTenantRegistration = false;
  @Input() OnlyAvailableProducts: boolean = false;
  @Output() upgradeClicked = new EventEmitter()

  RegistarationStepItems = [
    {label: 'Product Selection'},
    {label: 'Registration'},
    {label: 'Payment'},
    {label: 'Complete'}
];

  RegistarationSelectedStep = 0;
  ProductWithEditionList: ProductWithEditionDto[];
  selectedEditionData: EditionList;
  selectedAddonsData: AddOn[];
  selectedProductName;
  loading: boolean = true;
  editionsSelectOutput: EditionsSelectOutput = new EditionsSelectOutput();
  isUserLoggedIn: boolean = false;
  discountedPrice: any;
  expanded: boolean = false;
  currentIndex = null;
  productName = null;
  isAddonCollapsed = false;
  addonIndex = null;
  moduleIndex = null;
  showModules = null;
  isModuleCollapsed = false;
  isReadMore = true;
  isGoToCheckout: boolean = false;
  showTenantRegistration: boolean = false;
  isTenantSuccessfullyRegister: boolean = false;
  dataFetched: boolean = false;




  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
  editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];

  constructor(private injector: Injector, private _editionService: EditionServiceProxy, router: Router) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0) {
      this.isUserLoggedIn = true;
    }
    this.loading = true;
    this.dataFetched = false;
    this._editionService.getProductWithEdition(this.IncludeProductId, this.ExcludeProductId, this.OnlyAvailableProducts).subscribe(result => {
      this.loading = false;
      this.dataFetched = true;
      this.ProductWithEditionList = result;
      this.showModules = 2;
    })
  }
  isFree(edition? :EditionList): boolean {
    if (edition != null && edition != undefined) {
      if (edition.pricingtype != null && edition.pricingtype.length > 0) {
        return false;
      }
      if (edition.addons != null && edition.addons.length > 0
        && (edition.addons.findIndex(x => x["selected"] == true && x.addonPrice != null) >= 0)) {
        return false;
      }
    }
    return true;
  }

  expandedTrue(i, product) {

    this.currentIndex = i;
    this.productName = product;
    this.expanded = true;
    this.isAddonCollapsed = !this.isAddonCollapsed;
    this.isModuleCollapsed = !this.isModuleCollapsed

    // alert(product+","+i);
  }

  expandedFalse(i, product) {
    this.currentIndex = null;
    this.productName = product;
    this.expanded = false;
    this.currentIndex = null;
    this.isAddonCollapsed = !this.isAddonCollapsed;
    this.addonIndex = null;
    this.isModuleCollapsed = !this.isModuleCollapsed
    this.moduleIndex = null;
    // alert(product+","+i);
  }
  getFilteredEditions(edition, type) {
    if (edition != null) {
      if (type == "FREE") {
        return edition.filter(obj => obj.pricingtype == null || obj.pricingtype.length == 0)
      }
      else if (type == "PAID") {
        return edition.filter(obj => obj.pricingtype != null && obj.pricingtype.length > 0)
      }
    }
    else {
      return [];
    }
  }


  expandAddons(index) {
    this.addonIndex = index;
    this.isAddonCollapsed = !this.isAddonCollapsed;
  }

  expandModules(index) {
    this.moduleIndex = index;
    if (index >= 0) {
      this.isModuleCollapsed = false;
    }
    else {
      this.isModuleCollapsed = true;
    }
  }
  FreeTrail(edition: EditionList) {

  }
  BuyNow(edition: EditionList, productName) {
    if(this.IsTenantRegistration == true)
    {
      this.ShowRegisterTenant(edition, productName);
    }
    else{
      this.Upgrade(edition, productName);
    }
  }
  Upgrade(edition: EditionList, productName) {
    this.selectedProductName = productName;
    this.isGoToCheckout = true;
    this.selectedEditionData = edition;
    if (edition.addons != null && edition.addons.length > 0) {
      if (edition.addons != null && edition.addons.length > 0) {
        this.selectedAddonsData = edition.addons.filter(x => x["selected"] == true);
      }
    }
    this.upgradeClicked.emit(true);
  }
  ShowRegisterTenant(edition: EditionList, productName){
    this.RegistarationSelectedStep = 1;
    this.showTenantRegistration = true;
    this.selectedEditionData = edition;
    this.selectedProductName = productName;
    if (edition.addons != null && edition.addons.length > 0) {
      if (edition.addons != null && edition.addons.length > 0) {
        this.selectedAddonsData = edition.addons.filter(x => x["selected"] == true);
      }
    }
  }
  TenantSuccessfullyRegistered(tenantId){
    this.isTenantSuccessfullyRegister = true;
    this.isGoToCheckout = true;
    this.showTenantRegistration = false;
    this.IsTenantRegistration = false;
    this.RegistarationSelectedStep = 2;
  }
  BackClick() {
    this.RegistarationSelectedStep = 0;
    this.showTenantRegistration = false;
    this.isGoToCheckout = false
    this.ResetAllSelection();
    this.upgradeClicked.emit(false);
  }
  ResetAllSelection() {
    this.selectedAddonsData = [];
    this.selectedEditionData = null;
    this.ProductWithEditionList.forEach(product => {
      if (product != null && product.edition != null && product.edition.length > 0) {
        product.edition.forEach(edi => {
          if (edi != null && edi.pricingtype != null && edi.pricingtype != undefined && edi.pricingtype.length > 0) {
            edi.pricingtype.forEach(price => {
              price["selected"] = false;
            })
          }
          if (edi != null && edi.addons != null && edi.addons != undefined && edi.addons.length > 0) {
            edi.addons.forEach(addon => {
              addon["selected"] = false;
              if (addon != null && addon.addonPrice != null && addon.addonPrice != undefined && addon.addonPrice.length > 0) {
                addon.addonPrice.forEach(adPrice => {
                  adPrice["selected"] = false;
                })
              }
            })
          }
        })
      }
    })
  }
}

export class expanded {
  expand: false;
  index: null;
}

const roundTo = function (num: number, places: number) {
  const factor = 10 ** places;
  return Math.round(num * factor) / factor;
};

