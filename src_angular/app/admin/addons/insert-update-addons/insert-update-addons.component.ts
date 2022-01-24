import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EditionPricing } from '@app/admin/shared-models/Edition/EditionPricing';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddonListDto, AddonServiceProxy, CreateAddonDto, EditionServiceProxy, ModuleListDto, ModuleListForAddonDto, ModulePricingDto, PageModulesDto, PriceDiscount, SubModuleForAddonDto, SubModulesDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { finalize } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
};
@Component({
    selector: 'app-insert-update-addons',
    templateUrl: './insert-update-addons.component.html',
    styleUrls: ['./insert-update-addons.component.css']
})
export class InsertUpdateAddonsComponent extends AppComponentBase implements OnInit {
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('createUpdateModal', { static: true }) modal: ModalDirective;
    @ViewChild('addonForm') editionForm: NgForm;
    @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;

    active = false;
    saving = false;
    currencyMask = createNumberMask({
        prefix: '',
        allowDecimal: true
    });
    isFree: boolean = true;
    ProductId: number;
    isEdit: boolean = false;
    isStandAlone: boolean = false;
    EditionList = [];
    ProductList = [];
    ApproachList = [];
    ApproachId: number;
    EditionID: number;
    pricingTypes: EditionPricing[] = [];
    priceFormInvalid: boolean = false;
    // ActualAddonDataList = [];
    // AddonDataList = [];
    // SelectedAddonList = [];
    SelectedAddon: PageModulesDto;
    PageModuleList: PageModulesDto[];
    filteredPageModuleList: PageModulesDto[];
    PageSubModuleList: SubModulesDto[];
    AddonDataForEdit: AddonListDto;
    // AddonModuleDetails: any;
    AddonName;
    Description;
    // FromEditionName;
    ForEditionName;
    ModulesList: ModuleListForAddonDto[];
    SelectedIndex: number = -1;
    SelectedModule: ModuleListForAddonDto = null;
    IsScrollable: boolean = false;
    CanScrollLeft: boolean = false;
    CanScrollRight: boolean = false;
    SubSubModuleList: SubModuleForAddonDto[] = [];

    constructor(injector: Injector,
        private addonServiceProxy: AddonServiceProxy,
        private _editionService: EditionServiceProxy,
        public validationService: ValidationServiceService) {
        super(injector);
    }

    ngOnInit(): void {
    }
    // get Page Module list
    // GetAddonModuleList() {
    //     this.PageModuleList = [];
    //     this.PageSubModuleList = [];
    //     this._editionService.getModuleList().subscribe(result => {
    //         if (result != null) {
    //             this.PageModuleList = result.moduleList;
    //             this.PageSubModuleList = result.subModuleList;
    //         }
    //     });
    // }
    show(data?): void {
        this.active = true;
        if (data != null && data != undefined) {
            this.AddonDataForEdit = data;
            this.isStandAlone = this.AddonDataForEdit.isStandAlone;
            this.ProductId = this.AddonDataForEdit.productId;
            this.ApproachId = this.AddonDataForEdit.approachId;
            this.isFree = this.AddonDataForEdit.isFree;
            this.AddonName = this.AddonDataForEdit.addonName;
            this.ForEditionName = this.AddonDataForEdit.forEditionName;
            this.EditionID = this.AddonDataForEdit.forEditionId;
            this.Description = this.AddonDataForEdit.description;
            this.GetModuleListByEditionForAddon(this.EditionID);
            this.GetEditionListForAddon();
        }
        this.GetOtherDataForEdition();
        // if (!this.isEdit) {
        //     this.GetAddonModuleList();
        // }
        this.modal.show();
    }
    onShown(): void {
        document.getElementById('ddl_Product').focus();
    }
    GetModuleListByEditionForAddon(EditionId) {
        this.ModulesList = new Array<ModuleListForAddonDto>();
        this.SubSubModuleList = [];
        this.SelectedModule = null;
        this.IsScrollable = false;
        if (EditionId > 0) {
            this.addonServiceProxy.getModuleListByEditionForAddon(EditionId)
                .pipe().subscribe(result => {
                    this.ModulesList = new Array<ModuleListForAddonDto>();
                    if (result != null && result != undefined && result.length > 0) {
                        // filter modules, if duplicate modules get from different-different editions
                        result.forEach(module => {
                            let duplicateModuleIndex = this.ModulesList.findIndex(obj => obj.pageId == module.pageId);
                            if (duplicateModuleIndex >= 0) {
                                if (module.subModuleList != undefined && module.subModuleList != null) {
                                    if (this.ModulesList[duplicateModuleIndex].subModuleList != undefined && this.ModulesList[duplicateModuleIndex].subModuleList != null) {
                                        // check duplicate sub module
                                        module.subModuleList.forEach(subModule => {
                                            let duplicateSubModuleIndex = this.ModulesList[duplicateModuleIndex].subModuleList.findIndex(obj => obj.pageId == subModule.pageId);
                                            if (duplicateSubModuleIndex >= 0) {
                                                if (subModule.subSubModuleList != undefined && subModule.subSubModuleList != null) {
                                                    subModule.subSubModuleList.forEach(subSubModule => {
                                                        if (this.ModulesList[duplicateModuleIndex].subModuleList[duplicateSubModuleIndex].subSubModuleList != undefined && this.ModulesList[duplicateModuleIndex].subModuleList[duplicateSubModuleIndex].subSubModuleList != null) {
                                                            // check duplicate sub sub module
                                                            let duplicateSubSubModuleIndex = this.ModulesList[duplicateModuleIndex].subModuleList[duplicateSubModuleIndex].subSubModuleList.findIndex(obj => obj.pageId == subSubModule.pageId);
                                                            if (duplicateSubSubModuleIndex < 0) {
                                                                this.ModulesList[duplicateModuleIndex].subModuleList.push(subSubModule);
                                                            }
                                                        }
                                                        else {
                                                            this.ModulesList[duplicateModuleIndex].subModuleList.push(subSubModule);
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                this.ModulesList[duplicateModuleIndex].subModuleList.push(subModule);
                                            }
                                        });
                                    }
                                    else {
                                        this.ModulesList[duplicateModuleIndex].subModuleList = module.subModuleList;
                                    }
                                }
                            }
                            else {
                                this.ModulesList.push(module);
                            }
                        })
                    }
                    if (this.isEdit) {
                        this.GetAddonModuleAndPricing(this.AddonDataForEdit.addonId);
                    }
                    this.CheckScrollable();
                });
        }
    }
    GetEditionListForAddon() {
        this.EditionList = [];
        this.ModulesList = [];
        this.SubSubModuleList = [];
        this.SelectedModule = null;
        if (this.ProductId > 0) {
            this.addonServiceProxy.getEditionListForAddon(this.ProductId)
                .pipe().subscribe(result => {
                    this.EditionList = result.items;
                });
        }
    }
    GetOtherDataForEdition() {
        this.ProductList = [];
        this.ApproachList = [];
        this._editionService.getOtherDataForEdition().subscribe(result => {
            if (result != null) {
                this.ApproachList = result.table;
                this.ProductList = result.table1;
                if (this.ApproachId == null || this.ApproachId == 0) {
                    this.ApproachId = this.ApproachList[0].id;
                }
            }
        });
    }
    GetAddonModuleAndPricing(AddonId) {
        // this.AddonModuleDetails = null;
        this.addonServiceProxy.getAddonModuleAndPricing(AddonId)
            .pipe().subscribe(result => {
                this.getPricingTypes(result.pricingData);
                if (result.moduleList != null && result.moduleList.length > 0) {
                    // Module data selection
                    result.moduleList.forEach(module => {
                        let moduleIndex = this.ModulesList.findIndex(obj => obj.pageId == module.pageId);
                        if (moduleIndex >= 0) {
                            this.ModulesList[moduleIndex]["selected"] = true;

                            // Sub Module data selection
                            if (module.subModuleList != null && module.subModuleList.length > 0) {
                                module.subModuleList.forEach(subModule => {
                                    if (this.ModulesList[moduleIndex].subModuleList != null && this.ModulesList[moduleIndex].subModuleList.length > 0) {
                                        let subModuleIndex = this.ModulesList[moduleIndex].subModuleList.findIndex(obj => obj.pageId == subModule.pageId);
                                        if (subModuleIndex >= 0) {
                                            this.ModulesList[moduleIndex].subModuleList[subModuleIndex]["selected"] = true;

                                            // Sub Sub Module data selection
                                            if (subModule.subSubModuleList != null && subModule.subSubModuleList.length > 0) {
                                                subModule.subSubModuleList.forEach(subSubModule => {
                                                    if (this.ModulesList[moduleIndex].subModuleList[subModuleIndex].subSubModuleList != null && this.ModulesList[moduleIndex].subModuleList[subModuleIndex].subSubModuleList.length > 0) {
                                                        let subSubModuleIndex = this.ModulesList[moduleIndex].subModuleList.findIndex(obj => obj.pageId == subSubModule.pageId);
                                                        if (subSubModuleIndex >= 0) {
                                                            this.ModulesList[moduleIndex].subModuleList[subModuleIndex].subSubModuleList[subSubModuleIndex]["selected"] = true;
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            });
    }
    ScrollLeft() {
        let scroll = 100;
        let ele = document.getElementById('module_content')
        ele.scrollLeft -= scroll;
        this.CanScrollRight = true;
        this.CanScrollLeft = ele.scrollLeft > 0;
    }
    ScrollRight() {
        let scroll = 100;
        let ele = document.getElementById('module_content')
        this.CanScrollLeft = true;
        if ((ele.scrollWidth - ele.clientWidth) - ele.scrollLeft > scroll) {
            this.CanScrollRight = true;
        }
        else {
            this.CanScrollRight = false;
        }
        ele.scrollLeft += scroll;
    }
    CheckScrollable() {
        this.IsScrollable = false;
        this.CanScrollLeft = false;
        this.CanScrollRight = false;
        let timer = setInterval(() => {
            let ele = document.getElementById('module_content')
            if (ele != null && ele != undefined) {
                const hasScrollableContent = ele.scrollWidth > ele.clientWidth;
                this.IsScrollable = hasScrollableContent;
                this.CanScrollLeft = false;
                this.CanScrollRight = this.IsScrollable;
                if (ele.clientWidth > 0) {
                    clearInterval(timer);
                }
            }
        }, 50)
    }
    SelectModuleAction(module, index, isConfirmed = false) {
        this.SubSubModuleList = [];
        if(!isConfirmed)
        {
            this.SelectedIndex = index;
        }
        if (module == null || isConfirmed) {
            this.ModulesList[this.SelectedIndex]["selected"] = false;
            if(this.ModulesList[this.SelectedIndex].subModuleList != null && this.ModulesList[this.SelectedIndex].subModuleList.length > 0){
                this.ModulesList[this.SelectedIndex].subModuleList.forEach(obj =>{
                    obj["selected"] = false;
                })
            }
            this.SelectedModule = null;
            this.SelectedIndex = -1;
            if(isConfirmed)
            {  // when user confirm YES while module selection change without selct any sub-module
                this.SelectModuleAction(module, index, false);
            }
        }
        else {
            this.ModulesList[index]["selected"] = true;
            this.SelectedIndex = index;
            this.SelectedModule = module;
        }
    }
    SelectModule(module, index) {
        if (this.SelectedIndex >= 0 && this.SelectedIndex != index) {
          if (!this.ModulesList[this.SelectedIndex].subModuleList) {
            this.SelectModuleAction(module, index, true);
          }
          else {
            let selectedSubModule = this.ModulesList[this.SelectedIndex].subModuleList.findIndex(obj => obj["selected"] == true);
            if (selectedSubModule >= 0) {
              this.SelectModuleAction(module, index);
            }
            else {
              this.message.confirm(
                this.l('EditionModuleChangeConfirmationMsg', this.SelectedModule.moduleName),
                this.l('AreYouSure'),
                isConfirmed => {
                  if(isConfirmed){
                    this.SelectModuleAction(module, index, true);
                  }
                  else{
                    return;
                  }
                }
              );
            }
          }
        }
        else{
          this.SelectModuleAction(module, index);
        }
      }
    
    SelectSubModule(subIndex) {
        if (this.ModulesList[this.SelectedIndex].subModuleList[subIndex]["selected"]) {
            this.ModulesList[this.SelectedIndex].subModuleList[subIndex]["selected"] = false;
        }
        else {
            this.ModulesList[this.SelectedIndex].subModuleList[subIndex]["selected"] = true;
        }
        this.SubSubModuleList = [];
        let selectedSubModules = this.ModulesList[this.SelectedIndex].subModuleList.filter(obj => obj["selected"] == true);
        selectedSubModules.forEach(obj => {
            this.SubSubModuleList.concat(obj.subSubModuleList);
        });
    }
    SelectSubSubModule(subSubModuleId) {
        this.ModulesList[this.SelectedIndex].subModuleList.forEach(obj => {
            if (obj.subSubModuleList != null && obj.subSubModuleList != undefined && obj.subSubModuleList.length > 0)
                obj.subSubModuleList.forEach(subModule => {
                    if (subModule.subModuleId == subSubModuleId) {
                        subModule["selected"] = true;
                    }
                    else {
                        subModule["selected"] = false;
                    }
                });
        });
    }
    resetPrices(isFree) {
        this.pricingTypes = new Array<EditionPricing>();
        if (isFree == false) {
            this.getPricingTypes();
        }
    }
    // get pricing types data
    getPricingTypes(pricingData?: ModulePricingDto[]) {
        this.pricingTypes = [];
        if (this.isFree == false) {
            this._editionService.getPricingTypes().subscribe(pricingTypes => {
                if (pricingTypes.items != null && pricingTypes.items.length > 0) {
                    this.pricingTypes = [];
                    pricingTypes.items.forEach(element => {
                        let filterdata = null;
                        if (pricingData != null && pricingData != undefined) {
                            filterdata = pricingData.filter(obj => obj.pricingTypeID == element.id);
                        }
                        if (filterdata != undefined && filterdata != null && filterdata.length > 0) {
                            this.pricingTypes.push({
                                Id: filterdata[0].editionPricingID,
                                PricingTypeId: element.id,
                                PricingTypeName: element.name,
                                NoOfDays: element.noOfDays,
                                DiscountedPrice: roundTo(Number(filterdata[0].amount) - (filterdata[0].amount * filterdata[0].discountPercentage) / 100, 2),
                                DiscountPercentage: filterdata[0].discountPercentage,
                                ActualPrice: filterdata[0].amount
                            })
                        }
                        else {
                            this.pricingTypes.push({
                                Id: null,
                                PricingTypeId: element.id,
                                PricingTypeName: element.name,
                                NoOfDays: element.noOfDays,
                                ActualPrice: null,
                                DiscountPercentage: null,
                                DiscountedPrice: null
                            })
                        }
                    });
                }
            });
        }
    }
    save() {
        let isModuleSubModuleSelected = false;
        let selectedModules = [];
        if (this.ModulesList != null && this.ModulesList != undefined && this.ModulesList.length > 0) {
            selectedModules = this.ModulesList.filter(obj => obj["selected"] == true);
            if (selectedModules != null && selectedModules.length > 0) 
            {
                selectedModules.forEach(obj => {
                    if (obj.subModuleList != null && obj.subModuleList.length > 0) 
                    {
                        let tempIndex = obj.subModuleList.findIndex(x => x["selected"] == true);
                        isModuleSubModuleSelected = true;
                        if(tempIndex < 0){
                            isModuleSubModuleSelected = false;
                            return;
                        }
                    }
                    else{
                        isModuleSubModuleSelected = false;
                        return;
                    }
                })
            }
        }
        if (isModuleSubModuleSelected) {
            this.priceFormInvalid = this.ValidatePriceForm();
            if (!this.priceFormInvalid) {
                const input = new CreateAddonDto();
                input.productId = this.ProductId;
                input.approachId = this.ApproachId;
                input.editionID = this.EditionID;
                input.addonName = this.AddonName;
                input.isStandAlone = this.isStandAlone;
                input.description = this.Description;
                input.addonId = this.AddonDataForEdit != null ? this.AddonDataForEdit.addonId : null;
                if (!this.isFree && this.pricingTypes.length > 0) {
                    input.priceDiscount = new Array<PriceDiscount>();
                    this.pricingTypes.forEach(obj => {
                        input.priceDiscount.push(new PriceDiscount({
                            pricingTypeId: obj.PricingTypeId,
                            amount: obj.ActualPrice,
                            discountPercentage: obj.DiscountPercentage
                        }));
                    });
                }
                input.moduleList = new Array<ModuleListDto>();
                for (let i = 0; i < selectedModules.length; i++) {
                    input.moduleList.push(new ModuleListDto({
                        editionModuleId: selectedModules[i].moduleId,
                        moduleName: selectedModules[i].moduleName,
                        subModuleList: this.fillSubModuleDataToInsert(selectedModules[i].moduleId),
                        pageModuleId: selectedModules[i].pageId
                    }));
                }
                this.saving = true;
                this.addonServiceProxy.insertUpdateAddonModuleAndPricing(input)
                    .pipe(finalize(() => this.saving = false))
                    .subscribe(() => {
                        this.notify.info(this.l('SavedSuccessfully'));
                        this.Reset();
                        this.modalSave.emit(null);
                    });
            }
            else {
                // Pricing tab selection
                this.selectTab(2);
            }
        }
        else {
            this.notify.warn(this.l('PleaseSelectValidModuleAndSubModules'));
            this.selectTab(1);
        }
    }
    selectTab(tabId: number) {
        if (this.staticTabs?.tabs[tabId]) {
            this.staticTabs.tabs[tabId].active = true;
        }
    }
    fillSubModuleDataToInsert(moduleId) {
        let index = this.ModulesList.findIndex(obj => obj.moduleId == moduleId)
        if (this.ModulesList[index].subModuleList != null && this.ModulesList[index].subModuleList.length > 0) {
            let selectedSubModules = this.ModulesList[index].subModuleList.filter(obj => obj["selected"] == true);
            if (selectedSubModules != null && selectedSubModules.length > 0) {
                let subModules = new Array<ModuleListDto>();
                for (let i = 0; i < selectedSubModules.length; i++) {
                    subModules.push(new ModuleListDto(
                        {
                            editionModuleId: selectedSubModules[i].subModuleId,
                            moduleName: selectedSubModules[i].subModuleName,
                            subModuleList: this.fillSubSubModuleDataToInsert(selectedSubModules[i].subSubModuleList),
                            pageModuleId: selectedSubModules[i].pageId
                        }
                    ));
                }
                return subModules;
            }
        }
        return null;
    }
    fillSubSubModuleDataToInsert(subSubModules) {
        if (subSubModules != null && subSubModules.length > 0) {
            let subModules = new Array<ModuleListDto>();
            subSubModules.forEach(element => {
                if (element["selected"] == true) {
                    subModules.push(new ModuleListDto(
                        {
                            editionModuleId: element.subModuleId,
                            moduleName: element.subModuleName,
                            subModuleList: null,
                            pageModuleId: element.pageId
                        }
                    ));
                }
            })
            return subModules;
        }
        return null;
    }
    // SearchAddonModule(event) {
    //     let filtered: any[] = [];
    //     let query = event.query.trim();
    //     for (let i = 0; i < this.PageModuleList.length; i++) {
    //         let module = this.PageModuleList[i];
    //         if (module.displayName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
    //             filtered.push(module);
    //         }
    //     }

    //     this.filteredPageModuleList = filtered;
    // }
    // AddAddonModule() {
    // }
    Reset(): void {
        this.editionForm.reset();
        this.isFree = true;
        this.active = false;
        this.ProductId = null;
        this.isEdit = false;
        this.EditionList = [];
        this.ProductList = [];
        this.ApproachList = [];
        this.ApproachId = null;
        this.EditionID = null;
        this.pricingTypes = Array<EditionPricing>();
        this.priceFormInvalid = false;
        // this.AddonDataList = [];
        // this.ActualAddonDataList = [];
        // this.SelectedAddonList = [];
        this.AddonDataForEdit = null;
        this.isStandAlone = false;
        // this.AddonModuleDetails = null;
        this.SelectedModule = null;
        this.SelectedIndex = -1;
        this.modal.hide();
    }
    ValidatePriceForm(): boolean {
        this.priceFormInvalid = false;
        if (this.isFree) {
            return false;
        }
        if (this.pricingTypes != null && this.pricingTypes.length > 0) {
            for (let i = 0; i < this.pricingTypes.length; i++) {
                let element = this.pricingTypes[i];
                if ((element.ActualPrice == null || element.ActualPrice <= 0)
                    || (element.DiscountPercentage == null || element.DiscountPercentage < 0 || element.DiscountPercentage > 100)
                    || (element.DiscountedPrice == null || element.DiscountedPrice <= 0)) {
                    this.priceFormInvalid = true;
                    break;
                }
            }
            return this.priceFormInvalid;
        }
        else {
            return false;
        }
    }
    ActualPriceInput(data) {
        let PerDayPrice = data.ActualPrice / data.NoOfDays
        for (let i = 0; i < this.pricingTypes.length; i++) {
            let item = this.pricingTypes[i];
            if (item.ActualPrice == 0 || item.ActualPrice == null) {
                item.ActualPrice = roundTo(PerDayPrice * item.NoOfDays, 2);
            }
            if (item.DiscountPercentage == null || item.DiscountPercentage <= 0) {
                if (i == 0) {
                    item.DiscountPercentage = 0;
                } else {
                    item.DiscountPercentage = roundTo(Number(this.pricingTypes[i - 1].DiscountPercentage) + 5, 2);
                }
            }
            item.DiscountedPrice = roundTo(Number(item.ActualPrice) - (item.ActualPrice * item.DiscountPercentage) / 100, 2);
        }
    }
    DiscountPercentageInput(data) {
        for (let i = 0; i < this.pricingTypes.length; i++) {
            let item = this.pricingTypes[i];
            if (item.NoOfDays > data.NoOfDays) {
                if (i != 0 && (item.DiscountPercentage == null || item.DiscountPercentage <= 0)) {
                    item.DiscountPercentage = roundTo(Number(this.pricingTypes[i - 1].DiscountPercentage) + 5, 2);
                }
            }
            // if (item.DiscountPercentage > 0) {

            // }
            if (item.ActualPrice == 0 || item.ActualPrice == null) {
                item.DiscountedPrice = 0;
            }
            else {
                item.DiscountedPrice = roundTo(Number(item.ActualPrice) - (item.ActualPrice * item.DiscountPercentage) / 100, 2);
            }
        }
    }
    DicountedPriceInput(item) {
        if (item.ActualPrice > 0 && item.DiscountedPrice > 0 && item.ActualPrice > item.DiscountedPrice) {
            item.DiscountPercentage = roundTo(((Number(item.ActualPrice) - Number(item.DiscountedPrice)) * 100) / item.ActualPrice, 2);
        }
        else if (item.ActualPrice > 0 && item.DiscountPercentage > 0 && item.ActualPrice < item.DiscountedPrice) {
            item.ActualPrice = roundTo((item.DiscountedPrice * 100) / (100 - item.DiscountPercentage), 2);
        }
        // else if(item.ActualPrice > 0 && item.DiscountPercentage > 0){
        //     item.DiscountedPrice = Number(item.ActualPrice) - (item.ActualPrice*item.DiscountPercentage)/100
        // }
        else if (item.DiscountedPrice > 0 && item.DiscountPercentage > 0) {
            item.ActualPrice = roundTo((item.DiscountedPrice * 100) / (100 - item.DiscountPercentage), 2);
        }
        else if (item.ActualPrice > 0 && item.DiscountPercentage == 0) {
            item.ActualPrice = item.DiscountedPrice;
        }
        else {
            item.DiscountedPrice = 0;
        }
    }
}
