import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonServiceProxy, EditionCompareResultDto, EditionListByProductDto, EditionPaymentType, EditionServiceProxy, MasterDataDto, SubscriptionStartType, AddonServiceProxy, AvailableAddonModulesDto, AddonCompareResultDto, AddonCompareModuleList } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-addon-compare',
  templateUrl: './addon-compare.component.html',
  styleUrls: ['./addon-compare.component.css']
})
export class AddonCompareComponent extends AppComponentBase implements OnInit {

  ProductList: MasterDataDto[];
  EditionList: EditionListByProductDto[];
  ProductEditionData : ProductEditionModel[];
  compareData : ProductEditionModel[] = [];
  AddonList : AvailableAddonModulesDto[] =[];
  AddonCompareList : AddonCompareResultDto[];
  ModuleList : AddonCompareModuleList[];
  compairing: boolean = false;
  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
  editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];
  defaultIcon = "flaticon-bag";
  iconIndex = 0;
  canBack: boolean = false;

  constructor(private injector: Injector, private _commonService: CommonServiceProxy,
    private _activatedRoute: ActivatedRoute, private _editionService: EditionServiceProxy,private _addonService : AddonServiceProxy ) {
    super(injector);
  }

  ngOnInit(): void {
    this.canBack = this._activatedRoute.snapshot.queryParams['canBack'];
    this.GetProductList();
    this.ProductEditionData = [
                              { productId:0,editionId:0,editionList:[],addonId:0,addonList:[],icon:null},
                               {productId:0,editionId:0,editionList:[],addonId:0,addonList:[],icon:null},
                              {productId:0,editionId:0,editionList:[],addonId:0,addonList:[],icon:null},
                              {productId:0,editionId:0,editionList:[],addonId:0,addonList:[],icon:null}
                            ];
  }

  GetProductList() {
    this._commonService.getMasterData_Cache("PRODUCT").subscribe(result => {
      this.ProductList = result[0].masterData;

      // console.log(this.ProductList)
    })
  }

  SelectedProduct(index) {
    if(this.ProductEditionData[index].productId > 0 )
    {
      this.ProductEditionData[index].editionList = [];
      this._editionService.getEditionsByProductId(this.ProductEditionData[index].productId, 0, '')
        .pipe().subscribe(result => {
          this.ProductEditionData[index].editionList = result.items;
         
          if (this.ProductEditionData[index].editionList != null && this.ProductEditionData[index].editionList.length > 0) {
            for (let i = 0; i < this.ProductEditionData[index].editionList.length; i++) {
               // push icons
                this.ProductEditionData[index].editionList[i]["icon"] = this.editionIcons[this.iconIndex];
                this.iconIndex++;
                if(this.iconIndex == this.editionIcons.length){
                  this.iconIndex = 0;
                }
              // set disabled
              // let existEditioIndex = this.ProductEditionData.findIndex(obj => obj.editionId == this.ProductEditionData[index].editionList[i].id)
              // if(existEditioIndex >= 0){
              //   this.ProductEditionData[index].editionList[i]["disabled"] = true;
              // }else{
              //   this.ProductEditionData[index].editionList[i]["disabled"] = false;
              // }
            }
            
          }
        });
    }

    else{
      this.ProductEditionData[index] = new ProductEditionModel();;
    }

  }
  
  SelectEdition(index){
    let editionIndex = this.ProductEditionData[index].editionList.findIndex( x=> x.id == this.ProductEditionData[index].editionId )
    this.ProductEditionData[index].icon = this.ProductEditionData[index].editionList[editionIndex]["icon"]
    if(this.ProductEditionData[index].editionId > 0 ){
    this._addonService.getAddonListByEditionId(this.ProductEditionData[index].editionId, "nonstandalone").pipe().subscribe(res =>{
      this.ProductEditionData[index].addonList = res;
      if (this.ProductEditionData[index].editionList != null && this.ProductEditionData[index].editionList.length > 0) {
      if(this.ProductEditionData[index].addonList !=  null && this.ProductEditionData[index].addonList != undefined && this.ProductEditionData[index].addonList.length > 0)
      {
      for (let i = 0; i < this.ProductEditionData[index].addonList.length; i++) {
       // set disabled
              let existEditioIndex = this.ProductEditionData.findIndex(obj => obj.addonId == this.ProductEditionData[index].addonList[i].addonId)
              if(existEditioIndex >= 0){
                this.ProductEditionData[index].addonList[i]["disabled"] = true;
              }else{
                this.ProductEditionData[index].addonList[i]["disabled"] = false;
              }
            }
          }
        }
    });
  }
    else
    {
      this.ProductEditionData[index] = new ProductEditionModel();;
    }
  }
  SelectAddon(i){
    let addonIndex = this.ProductEditionData
  }

  compare(product){
    // console.log(product);
     this.compareData = []
    for(let i = 0 ; i<this.ProductEditionData.length ; i++){
      if(product[i]?.productId > 0 && product[i]?.editionId > 0)
      {
        this.compareData.push(product[i]);
      }
    }

    // console.log(this.compareData);
    if(this.compareData.length < 2){
      this.notify.warn(this.l("PleaseSelectMoreThanOneAddon"));
      return;
    }

    for(let i = 0; i<this.compareData.length ; i++){
      for(let j = i+1 ; j<this.compareData.length ; j++){
        if(this.compareData[i].addonId == this.compareData[j].addonId && this.compareData[i].editionId == this.compareData[j].editionId){
          this.notify.warn(this.l("DuplicateAddon"))
          return;
        }
      }
    }

    // this._editionCompareService.getEditionDeatilsByEditionIdForCompare
    let addonId : string = null;
    this.AddonCompareList = null;
    this.compairing = true;
    addonId = this.compareData.map(x=>x.addonId).toString();
    this._addonService.getAddonDetailsByAddonIdsForCompare(addonId).pipe(finalize(() => { this.compairing = false; })).subscribe(result=>{
      this.AddonCompareList = result;
      console.log(this.AddonCompareList);
      // console.log(this.ProductEditionCompareList)
    })
    
    // this.ProductEditionData = 
    //   [
    //     { productId:0,editionId:0,editionList:[],icon:null},
    //      {productId:0,editionId:0,editionList:[],icon:null},
    //     {productId:0,editionId:0,editionList:[],icon:null},
    //     {productId:0,editionId:0,editionList:[],icon:null}
    //   ];
    
    // this.ProductEditionData = null;
    // this.notify.success(this.l("Success"))
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

  selectedEdition(editionIndex){
    
  }
  toggleShow(index, i, isExpend) {
    this.AddonCompareList[i].moduleList[index]["expended"] = isExpend;
    }
    toggleSubShow(index,i,j, isExpend) {
     this.AddonCompareList[i].moduleList[index].subModuleList[j]["expended"] = isExpend;
      }

}

export class ProductEditionModel{
  editionList : EditionListByProductDto[];
  editionId : number;
  productId : number;
  addonId : number;
  addonList : AvailableAddonModulesDto[];
  icon : string;
  constructor(){
    this.editionList = new Array<EditionListByProductDto>();
    this.addonList = new Array<AvailableAddonModulesDto>();
    this.editionId = 0;
    this.productId = 0;
  }
}







