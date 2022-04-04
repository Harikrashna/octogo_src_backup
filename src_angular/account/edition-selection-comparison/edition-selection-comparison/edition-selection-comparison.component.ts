import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { EditionPaymentType, EditionServiceProxy, ProductWithEditionDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';
import { distinct, ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-edition-selection-comparison',
  templateUrl: './edition-selection-comparison.component.html',
  styleUrls: ['./edition-selection-comparison.component.css'],
  encapsulation : ViewEncapsulation.None,
  animations: [accountModuleAnimation()]
})
export class EditionSelectionComparisonComponent extends AppComponentBase implements OnInit {

  ProductWithEditionList: ProductWithEditionDto[]
  isUserLoggedIn: boolean = false;
  discountedPrice: any;
  expanded: boolean = true;
  currentIndex = null;
  productName = null;
  isAddonCollapsed = false;
  addonIndex = null;
  showModules = null;
  isModuleCollapsed = false;
  isReadMore = true;
  Modules = [];
  expandSubModules : boolean = false;
  moduleExpandIndex = null;
  isChecked: boolean = true;
  IsScrollable = false;
  addons: addons[] = [];
  dataDisplayStyle = [{name: 'Table View', code: 'TABLE'}, {name: 'Grid View', code: 'GRID'}, {name: 'Card View', code: 'CARD'}];
  selectedDataDisplayStyle;



  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;

  constructor(injector: Injector, private _editionService: EditionServiceProxy) {
    super(injector)
    this.selectedDataDisplayStyle = this.dataDisplayStyle[0];
  }

  ngOnInit(): void {
    if (this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0) {
      this.isUserLoggedIn = true;
    }
    this.spinnerService.show();
    this._editionService.getProductWithEdition(0,0,0,false, false).subscribe(result => {
      this.spinnerService.hide();
      this.ProductWithEditionList = result;
      this.CheckScrollable();

      for(let i = 0; i<this.ProductWithEditionList.length ; i++)
      {
        this.ProductWithEditionList[i]["expanded"] = true;

      }

      console.log(this.ProductWithEditionList);
      console.log(this.ProductWithEditionList[0].edition);
      for (let i = 0; i < this.ProductWithEditionList.length; i++) {
        let uniqueModules: any[] = [];
        for (let j = 0; j < this.ProductWithEditionList[i]?.edition?.length; j++) {
          for (let k = 0; k < this.ProductWithEditionList[i]?.edition[j]?.module?.length; k++) {
            let tempRes = uniqueModules.filter(obj => obj.moduleName == this.ProductWithEditionList[i]?.edition[j]?.module[k].moduleName);
            if (!(tempRes != null && tempRes != undefined && tempRes.length > 0)) {
              uniqueModules.push(this.ProductWithEditionList[i]?.edition[j]?.module[k]);
            }
          }
          
        }
        this.ProductWithEditionList[i]["uniqueModuleName"] = uniqueModules;
      }
    })
  }

  CheckScrollable() {
    if (this.ProductWithEditionList != null && this.ProductWithEditionList != undefined && this.ProductWithEditionList.length > 0) {
      for (let i = 0; i < this.ProductWithEditionList.length; i++) {
        this.ProductWithEditionList[i]["IsScrollable"] = false;
        let timer = setInterval(() => {
          let ele = document.getElementById('edition_content' + i)
          if (ele != null && ele != undefined) {
            const hasScrollableContent = ele.scrollWidth > ele.clientWidth;
            this.ProductWithEditionList[i]["IsScrollable"] = hasScrollableContent;
            if (ele.clientWidth > 0) {
              clearInterval(timer);
            }
          }
        }, 50)
      }
    }
  }

  expandedFalse(i, product) {
    // this.ProductWithEditionList[i].expanded 
    
    this.expanded = false;
    let expansionCount = this.ProductWithEditionList.filter(x => x["expanded"] == true && x.edition != null && x.edition.length > 0 )
    if(expansionCount != null && expansionCount != undefined && expansionCount.length > 1)
    {
      this.ProductWithEditionList[i]["expanded"] = this.expanded;
    
      this.productName = product.productName;
      this.currentIndex = i;
      console.log(i);
      console.log("expanded False" , product);
    }
    
  }

  expandedTrue(i, product) {
    this.expanded = true;
    this.ProductWithEditionList[i]["expanded"] = this.expanded;
    this.currentIndex = null;
    this.productName = product.productName;
    console.log("expanded true" , product);
  }

  isModuleExist(module, edition) {

    for (let i = 0; i < edition.module?.length; i++) {
      if (module.moduleName == edition.module[i].moduleName) {
        return true
      }
    }

    return false;
  }
  expandSubModuleRow(index){
    this.expandSubModules = true;
    this.moduleExpandIndex = index;
  }
  collapseSubModuleRow(){
    this.expandSubModules = false;
    this.moduleExpandIndex = null
  }

  isSubModuleExist(subModule , edition){
    for(let i =0 ; i<edition.module.length;i++){
      for(let j=0;j<edition.module[i]?.submodule?.length;j++)
      {
        if(subModule.subModuleName == edition.module[i]?.submodule[j].subModuleName)
        {
          return true;
        }
      }
    }
    return false;
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

  isFree(pricingData?): boolean {
    if (pricingData != null && pricingData.length > 0) {
      return false;
    }
    if (pricingData == undefined || pricingData == null) {
      return true;
    }
    return true;
  }
  ScrollLeft(index) {
    let scroll = 225;
    let ele = document.getElementById('edition_content' + index)
    ele.scrollLeft -= scroll;
  }
  ScrollRight(index) {
    let scroll = 225;
    let ele = document.getElementById('edition_content' + index);
    ele.scrollLeft += scroll;
  }
  DataDisplayStyleChange(){
    this.expandSubModules = false;
    this.moduleExpandIndex = null
  }
}


export class addons {
  addonId: number;
  addonName: string;
  addonPrice: pricingType[];

}

export class pricingType {
  id: number;
  name: string;
  price: number;
}
