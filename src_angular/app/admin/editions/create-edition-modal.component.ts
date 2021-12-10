import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonLookupServiceProxy, CreateEditionDto, EditionListByProductDto, EditionServiceProxy, ModuleDto, ModuleListDto, ModulePricingDto, PageModulesDto, PriceDiscount } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FeatureTreeComponent } from '../shared/feature-tree.component';
import { finalize } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { NgForm } from '@angular/forms';
import { AddEditionModulesComponent } from '../shared/add-edition-modules/add-edition-modules.component';
import { EditionModule } from '../shared-models/Edition/EditionModule';
import { EditionPricing } from '../shared-models/Edition/EditionPricing';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

const roundTo = function (num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
};
@Component({
    selector: 'createEditionModal',
    templateUrl: './create-edition-modal.component.html'
})
export class CreateEditionModalComponent extends AppComponentBase implements OnInit {

    @ViewChild('createUpdateModal', { static: true }) modal: ModalDirective;
    @ViewChild('featureTree') featureTree: FeatureTreeComponent;
    @ViewChild('editionForm') editionForm: NgForm;
    @ViewChild('editionModules') editionModules: AddEditionModulesComponent;
    @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    currencyMask = createNumberMask({
        prefix: '',
        allowDecimal: true
    });

    edition: CreateEditionDto = new CreateEditionDto();
    // expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    expireActionEnum: typeof AppEditionExpireAction = AppEditionExpireAction;
    isFree = true;
    isTrialActive = false;
    isWaitingDayActive = false;
    IsDependent = false;
    EditionList = [];
    DependantEditionID;
    discountPercentage: number;
    minPeriodForDescount: number;
    pricingTypes: EditionPricing[] = [];
    priceFormInvalid: boolean = false;
    isEdit: boolean = false;
    ProductId;
    ProductList = [];
    ApproachList = [];
    ApproachId;
    FreeEditionList = [];

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy
    ) {
        super(injector);
        this.discountPercentage = 5;    // This will come from back-end
        this.minPeriodForDescount = 90;      // This will come from back-end
    }
    ngOnInit(): void {
    }
    // get Product list, Approach List
    getOtherDataForEdition() {
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
    async editEdition(EditionId) {
        // this.Reset();
        this.isEdit = true;
        this.getEditionDetailsForEdit(EditionId);
    }
    getEditionDetailsForEdit(EditionId) {
        this._editionService.getEditionDetailsForEdit(EditionId).subscribe(result => {
            if (result != null) {
                this.edition.edition.id = result.id;
                this.edition.edition.displayName = result.displayName;
                this.edition.edition.expiringEditionId = result.expiringEditionId;
                this.ApproachId = result.approachId;
                this.ProductId = result.productId;
                this.edition.edition.trialDayCount = result.trialDayCount;
                this.isTrialActive = result.isTrialActive;
                this.edition.edition.waitingDayAfterExpire = result.waitingDayAfterExpire;
                this.isWaitingDayActive = result.waitAfterExpiry;
                this.DependantEditionID = result.dependantEditionID;
                this.IsDependent = result.dependantEdition;
                if (this.IsDependent) {
                    this.getEditions();
                }
                setTimeout(() => {
                    this.getEditionModulesData(EditionId, true);
                }, 500)
                if (result.pricingData != null && result.pricingData.length > 0) {
                    this.isFree = false;
                } else {
                    this.isFree = true;
                }
                if (this.edition.edition.expiringEditionId > 0) {
                    this.expireAction = AppEditionExpireAction.AssignToAnotherEdition;
                    this.getFreeEditions();
                }
                else {
                    this.expireAction = AppEditionExpireAction.DeactiveTenant;
                }
                this.getPricingTypes(result.pricingData);
                this.show(EditionId);
            }
        });
    }
    // Get Edition Modules data for Dependent Edition OR for Edit mode of Edition
    getEditionModulesData(EditionId, ForEdit: boolean = true) {
        if (this.editionModules != undefined && this.editionModules != null) {
            this.editionModules.ModulesList = [];
            this.editionModules.DependEditionData = [];
            if (EditionId > 0) {
                this._editionService.getEditionModules(EditionId).subscribe(result => {
                    if (result != null) {
                        this.editionModules.DependEditionData = result.dependEditionData;
                        if (ForEdit == true && result.modulesData != null && result.modulesData.length > 0) {
                            // this.editionModules.ModulesList = result.modulesData;
                            result.modulesData.forEach(element => {
                                this.editionModules.ModulesList.push({
                                    ModuleName: element.moduleName,
                                    SubModuleList: this.fillSubModuleData(element.subModuleList),
                                    CanAddSubModule: false,
                                    EditionModuleId: element.moduleId,
                                    PageModuleId: element.pageModuleId
                                })
                            })
                        }
                        else if (this.IsDependent && ForEdit == false && result.modulesData != null && result.modulesData.length > 0) {
                            this.editionModules.DependEditionData.unshift({
                                editionId: this.DependantEditionID,
                                displayName: this.EditionList.filter(obj => obj.id == this.DependantEditionID)[0].displayName,
                                moduleData: result.modulesData,
                            });
                        }
                        if (this.editionModules.DependEditionData != null && this.editionModules.DependEditionData.length > 0) {
                            this.editionModules.DependEditionData.forEach(obj => {
                                obj["Collapse"] = true;
                                if (obj.moduleData != null && obj.moduleData.length) {
                                    obj.moduleData.forEach(ele => {
                                        ele["Collapse"] = true;
                                    })
                                }
                            })
                        }
                    }
                });
            }
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
    show(editionId?: number): void {
        this.active = true;
        this.getOtherDataForEdition();
        // this._commonLookupService.getEditionsForCombobox(true).subscribe(editionsResult => {
        //     this.expiringEditions = editionsResult.items;
        //     this.expiringEditions.unshift(new ComboboxItemDto({ value: null, displayText: this.l('NotAssigned'), isSelected: true }));

        this._editionService.getEditionForEdit(editionId).subscribe(editionResult => {
            this.featureTree.editData = editionResult;
            this.modal.show();
        });
        // });
    }

    onShown(): void {
        document.getElementById('product').focus();
    }

    resetPrices(isFree) {
        this.pricingTypes = new Array<EditionPricing>();
        if (isFree == false) {
            this.getPricingTypes();
        }
        // this.edition.edition.annualPrice = undefined;
        // this.edition.edition.monthlyPrice = undefined;
    }

    removeExpiringEdition(isDeactivateTenant) {
        this.edition.edition.expiringEditionId = null;
    }

    save(): void {
        if (!this.featureTree.areAllValuesValid()) {
            this.message.warn(this.l('InvalidFeaturesWarning'));
            return;
        }
        this.priceFormInvalid = this.ValidatePriceForm();
        if (this.editionModules.ModulesList.length > 0) {
            if (!this.priceFormInvalid) {
                const input = new CreateEditionDto();
                input.moduleList = new Array<ModuleListDto>();
                input.edition = this.edition.edition;
                input.featureValues = this.featureTree.getGrantedFeatures();
                input.dependantEditionID = this.DependantEditionID;
                input.productId = this.ProductId;
                input.approachId = this.ApproachId;
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
                if (this.isEdit && this.editionModules.DependEditionData != null && this.editionModules.DependEditionData.length > 0) {
                    for (let i = 0; i < this.editionModules.DependEditionData.length; i++) {
                        this.editionModules.DependEditionData[i].moduleData.forEach(element => {
                            input.moduleList.push(new ModuleListDto({
                                editionModuleId: element.moduleId,
                                moduleName: element.moduleName,
                                subModuleList: this.fillData(this.fillSubModuleData(element.subModuleList)),
                                pageModuleId: element.PageModuleId
                            }));
                        });
                    }
                }
                this.editionModules.ModulesList.forEach(element => {
                    input.moduleList.push(new ModuleListDto({
                        editionModuleId: element.EditionModuleId,
                        moduleName: element.ModuleName,
                        subModuleList: this.fillData(element.SubModuleList),
                        pageModuleId: element.PageModuleId
                    }));
                });
                this.saving = true;
                this._editionService.createEdition(input)
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
            // Module tab selection
            this.selectTab(1);
        }
    }
    selectTab(tabId: number) {
        if (this.staticTabs?.tabs[tabId]) {
            this.staticTabs.tabs[tabId].active = true;
        }
    }
    fillData(data?: EditionModule[]) {
        let subModules = new Array<ModuleListDto>();
        if (data != null && data != undefined && data.length > 0) {
            data.forEach(element => {
                subModules.push(new ModuleListDto({
                    editionModuleId: element.EditionModuleId,
                    moduleName: element.ModuleName,
                    subModuleList: this.fillData(element.SubModuleList),
                    pageModuleId: element.PageModuleId
                }));
            });
        }
        else {
            return null;
        }
        return subModules;
    }
    fillSubModuleData(data?: ModuleDto[]) {
        let subModules = new Array<EditionModule>();
        if (data != null && data != undefined && data.length > 0) {
            data.forEach(element => {
                subModules.push({
                    ModuleName: element.moduleName,
                    EditionModuleId: element.subModuleId,
                    SubModuleList: this.fillSubModuleData(element.subModuleList),
                    PageModuleId: element.pageModuleId 
                });
            });
        }
        else {
            return [];
        }
        return subModules;
    }
    Reset(): void {
        this.editionForm.reset();
        this.isFree = true;
        this.IsDependent = false;
        this.active = false;
        this.isEdit = false;
        this.pricingTypes = [];
        this.ApproachList = [];
        this.EditionList = [];
        this.ProductList = [];
        this.ProductId = null;
        this.DependantEditionID = null;
        this.edition = new CreateEditionDto();
        this.modal.hide();
    }
    getEditions(): void {
        this.EditionList = [];
        if (this.IsDependent) {
            this._editionService.getEditionsByProductId(this.ProductId, 0, '')
                .pipe().subscribe(result => {
                    this.EditionList = result.items;
                });
        }
        else {
            this.DependantEditionID = null;
        }
    }
    getFreeEditions() {
        this.FreeEditionList = [];
        if (this.ProductId != null && !this.isFree) {
            this._editionService.getEditionsByProductId(this.ProductId, 0, 'FREE')
                .pipe().subscribe(result => {
                    this.FreeEditionList = result.items;
                    this.FreeEditionList.unshift(new EditionListByProductDto({ name: null, displayName: this.l('NotAssigned'), id: 0 }));

                });
        }
    }
    resetEditionIds() {
        this.DependantEditionID = null;
        this.edition.edition.expiringEditionId = null;
    }
    calculateDiscounts(event) {
        // this.edition.edition.monthlyPrice = Number(event.target.value);
        // if(this.edition.edition.monthlyPrice > 0){
        // let oneDayPrice = this.edition.edition.monthlyPrice / 30;
        // this.edition.edition.quarterlyPrice = (oneDayPrice*90) - (oneDayPrice*90* this.discountPercentage*1)/100;
        // this.edition.edition.halfYearlyPrice = (oneDayPrice*180) - (oneDayPrice*180* this.discountPercentage*2)/100;
        // this.edition.edition.annualPrice = (oneDayPrice*365) - (oneDayPrice*365* this.discountPercentage*3)/100;
        // }
        // else{
        //     this.edition.edition.quarterlyPrice = null;
        //     this.edition.edition.halfYearlyPrice = null;
        //     this.edition.edition.annualPrice = null;
        // }
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
    IsNumericWithDot(e, value: any = "", num) {
        value = value != null ? value.toString() : "";
        if ((value.indexOf(".") >= 0) && (value.length - value.indexOf(".") > num)) {
            return false
        }
        var keyCode = e.which ? e.which : e.keyCode
        var ret = ((keyCode >= 48 && keyCode <= 57) || keyCode == 46 || keyCode == 0);
        if (ret && value != null) {
            let IsDoubleDot = value.includes('.');
            if (IsDoubleDot) {
                let input = String.fromCharCode(e.charCode);
                const reg = /^\d*(?:[.,]\d{1,2})?$/;
                if (!reg.test(input)) {
                    e.preventDefault();
                }
            }
        }
        return ret;
    }
}