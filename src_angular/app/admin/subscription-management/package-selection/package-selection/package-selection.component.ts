import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddOn, EditionList, EditionPaymentType, EditionServiceProxy, EditionsSelectOutput, InvoiceDataInputDto, ProductWithEditionDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';

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
    { label: 'Product Selection' },
    { label: 'Registration' },
    { label: 'Payment' },
    { label: 'Invoice Details' },
    { label: 'Complete' }
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
  isGoToInvoice: boolean = false;
  showTenantRegistration: boolean = false;
  isTenantSuccessfullyRegister: boolean = false;
  dataFetched: boolean = false;




  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
  editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];
  InvoiceDetails:InvoiceDataInputDto = new InvoiceDataInputDto() //Added by:Merajuddin
  constructor(private injector: Injector, private _editionService: EditionServiceProxy, router: Router) {
    super(injector);
  }

  ngOnInit(): void {
    if (this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0) {
      this.isUserLoggedIn = true;
    }
    this.loading = true;
    this.dataFetched = false;
    this._editionService.getProductWithEdition(this.IncludeProductId, this.ExcludeProductId,0, this.OnlyAvailableProducts, false)
      .subscribe(result => {
        this.loading = false;
        this.dataFetched = true;
        this.ProductWithEditionList = this.SetRedundentModulesData(result);
        this.showModules = 2;
      })
  }
  SetRedundentModulesData(data: ProductWithEditionDto[]): ProductWithEditionDto[]{
    if(data != null && data != undefined && data.length > 0)
    {
      data.forEach(product =>
        {
          if(product != null && product != undefined && product.edition != null && product.edition.length > 0)
          {
            product.edition.forEach(edi =>
              {
                if(edi != null && edi != undefined && edi.module != null && edi.module != undefined && edi.module.length > 0)
                {
                  for(let modIndex =0; modIndex < edi.module.length; modIndex++)
                  {
                    let moduleData = edi.module.filter(x => x.moduleName == edi.module[modIndex].moduleName);
                    if(moduleData != null && moduleData.length > 1) // if modules duplicate in edition
                    {
                      for(let i = 1; i < moduleData.length; i++)
                      {
                        // push duplicate module's submodules to module's subModules 
                        if(moduleData[i].submodule != null && moduleData[i].submodule != undefined)
                        {
                        edi.module[modIndex].submodule.push(...moduleData[i].submodule);
                        let tempModuleIndex = edi.module.findIndex(x => x.moduleId == moduleData[i].moduleId);
                        edi.module.splice(tempModuleIndex, 1);      // Remove duplicate module
                        }
                      }
                      // merge duplicate sub-modules
                      if(edi.module[modIndex].submodule != null && edi.module[modIndex].submodule.length > 1)
                      {
                        for(let subModIndex =0; subModIndex < edi.module[modIndex].submodule.length; subModIndex++)
                        {
                          let subModuleData = edi.module[modIndex].submodule.filter(x => x.subModuleName == edi.module[modIndex].submodule[subModIndex].subModuleName);
                          if(subModuleData != null && subModuleData.length > 1) // if sub modules duplicate in module
                          {
                            // un-comment this code after getting Sub Sub module data from API

                            // for(let i = 1; i < subModuleData.length; i++)
                            // {
                            //   // push duplicate sub module's Sub-submodules to sub-module's Sub-subModules 
                            //   edi.module[modIndex].submodule[subModIndex].submodule.push(...subModuleData[i].submodule);
                            //   let tempSubModuleIndex = edi.module[modIndex].submodule.findIndex(x => x.subModuleID == subModuleData[i].subModuleID);
                            //   edi.module[modIndex].submodule.splice(tempSubModuleIndex, 1);      // Remove duplicate sub-module
                            // }
                          }
                        }
                      }
                    }
                  }
                }
              });
          }
        });
      return data;
    }
    return [];
  }
  isFree(edition?: EditionList): boolean {
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
    if (this.IsTenantRegistration == true) {
      this.ShowRegisterTenant(edition, productName);
    }
    else {
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
  ShowRegisterTenant(edition: EditionList, productName) {
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
  TenantSuccessfullyRegistered(tenantId) {
    this.isTenantSuccessfullyRegister = true;
    this.isGoToCheckout = true;
    this.showTenantRegistration = false;
    this.IsTenantRegistration = false;
    this.RegistarationSelectedStep = 2;
  }
  SubscriptionCompleted() {
    // this.isTenantSuccessfullyRegister = true;
    this.isGoToInvoice = true;
    this.isGoToCheckout = false;
    this.showTenantRegistration = false;
    this.IsTenantRegistration = false;
    this.RegistarationSelectedStep = 3;
  }
  InsertInvoiceDetails(){
    location.reload();
  }
  BackClick() {
    this.RegistarationSelectedStep = 0;
    this.showTenantRegistration = false;
    this.isGoToCheckout = false;
    this.isGoToInvoice = false;
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
  AddonDependencyMsg(isChecked, addon){
    if(isChecked.target.checked == true && addon.dependAddons != null && addon.dependAddons != undefined){
      this.message.info(
        this.l('AddonDependencyMsg', addon.dependAddons),
        this.l('AddOnInformation'),
      );
    }
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

