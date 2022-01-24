import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonServiceProxy, EditionCompareResultDto, EditionListByProductDto, EditionPaymentType, EditionServiceProxy, MasterDataDto, ProductWithEditionDto, SubscriptionStartType } from '@shared/service-proxies/service-proxies';
import { distinct, finalize, ignoreElements } from 'rxjs/operators';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-edition-compare',
  templateUrl: './edition-compare.component.html',
  styleUrls: ['./edition-compare.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [accountModuleAnimation()]
})
export class EditionCompareComponent extends AppComponentBase implements OnInit {

  ProductList: MasterDataDto[];
  EditionList: EditionListByProductDto[];
  ProductEditionData : ProductEditionModel[];
  compareData : ProductEditionModel[] = [];
  ProductEditionCompareList : EditionCompareResultDto[];
  compairing: boolean = false;
  subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
  editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
  editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];
  defaultIcon = "flaticon-bag";
  iconIndex = 0;
  constructor(private injector: Injector, private _commonService: CommonServiceProxy, private _editionService: EditionServiceProxy ) {
    super(injector);
  }

  ngOnInit(): void {
    this.GetProductList();
    this.ProductEditionData = [
                              { productId:0,editionId:0,editionList:[],icon:null},
                               {productId:0,editionId:0,editionList:[],icon:null},
                              {productId:0,editionId:0,editionList:[],icon:null},
                              {productId:0,editionId:0,editionList:[],icon:null}
                            ];
  }

  GetProductList() {
    this._commonService.getMasterData_Cache("PRODUCT").subscribe(result => {
      this.ProductList = result[0].masterData;

      console.log(this.ProductList)
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
              let existEditioIndex = this.ProductEditionData.findIndex(obj => obj.editionId == this.ProductEditionData[index].editionList[i].id)
              if(existEditioIndex >= 0){
                this.ProductEditionData[index].editionList[i]["disabled"] = true;
              }else{
                this.ProductEditionData[index].editionList[i]["disabled"] = false;
              }
            }
            
          }
        });
    }

    else{
      this.ProductEditionData[index] = new ProductEditionModel();;
    }

  }
  SelectEdition(i){
    let editionIndex = this.ProductEditionData[i].editionList.findIndex( x=> x.id == this.ProductEditionData[i].editionId )
    this.ProductEditionData[i].icon = this.ProductEditionData[i].editionList[editionIndex]["icon"]
  }

  compare(product){
    console.log(product);
     this.compareData = []
    for(let i = 0 ; i<this.ProductEditionData.length ; i++){
      if(product[i]?.productId > 0 && product[i]?.editionId > 0)
      {
        this.compareData.push(product[i]);
      }
    }

    console.log(this.compareData);
    if(this.compareData.length < 2){
      this.notify.warn(this.l("PleaseSelectMoreThanOneEditions"));
      return;
    }

    for(let i = 0; i<this.compareData.length ; i++){
      for(let j = i+1 ; j<this.compareData.length ; j++){
        if(this.compareData[i].editionId == this.compareData[j].editionId && this.compareData[i].productId == this.compareData[j].productId){
          this.notify.warn(this.l("DuplicateEdition"))
          return;
        }
      }
    }

    // this._editionCompareService.getEditionDeatilsByEditionIdForCompare
    let editionId : string = null;
    this.ProductEditionCompareList = null;
    this.compairing = true;
    editionId = this.compareData.map(x=>x.editionId).toString();
    this._editionService.getEditionDeatilsByEditionIdForCompare(editionId).pipe(finalize(() => { this.compairing = false; })).subscribe(result=>{
      this.ProductEditionCompareList = result;

      console.log(this.ProductEditionCompareList)
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
}

export class ProductEditionModel{
  editionList : EditionListByProductDto[];
  editionId : number;
  productId : number;
  icon : string;
  constructor(){
    this.editionList = new Array<EditionListByProductDto>();
    this.editionId = 0;
    this.productId = 0;
  }
}







