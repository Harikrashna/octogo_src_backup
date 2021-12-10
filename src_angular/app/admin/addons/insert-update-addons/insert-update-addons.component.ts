import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EditionPricing } from '@app/admin/shared-models/Edition/EditionPricing';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddonServiceProxy, CreateAddonDto, EditionServiceProxy, ModulePricingDto, PageModulesDto, PriceDiscount, SubModulesDto } from '@shared/service-proxies/service-proxies';
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
    isStandAlone: boolean = true;
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
    AddonDataForEdit: any;
    AddonModuleDetails: any;
    AddonName;
    FromEditionName;
    ForEditionName;

    constructor(injector: Injector,
        private addonServiceProxy: AddonServiceProxy,
        private _editionService: EditionServiceProxy,) {
        super(injector);
    }

    ngOnInit(): void {
    }
    // get Page Module list
    GetAddonModuleList() {
        this.PageModuleList = [];
        this.PageSubModuleList = [];
        this._editionService.getModuleList().subscribe(result => {
            if (result != null) {
                this.PageModuleList = result.moduleList;
                this.PageSubModuleList = result.subModuleList;
            }
        });
    }
    show(data?): void {
        this.active = true;
        if (data != null && data != undefined) {
            this.AddonDataForEdit = data;
            this.isStandAlone = this.AddonDataForEdit.isStandAlone;
            this.ProductId = this.AddonDataForEdit.productId;
            this.ApproachId = this.AddonDataForEdit.approachId;
            this.isFree = this.AddonDataForEdit.isFree;
            this.SelectedAddon = this.AddonDataForEdit.addonName;
            this.AddonName = this.AddonDataForEdit.addonName;
            this.FromEditionName = this.AddonDataForEdit.fromEditionName;
            this.ForEditionName = this.AddonDataForEdit.forEditionName;
            this.GetAddonDetailsByModuleId(this.AddonDataForEdit.moduleId);
        }
        this.GetOtherDataForEdition();
        if (!this.isEdit) {
            this.GetAddonModuleList();
        }
        this.modal.show();
    }
    onShown(): void {
        document.getElementById('product').focus();
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
    // GetAddonByEditionId() {
    //     this.AddonDataList = [];
    //     this.ActualAddonDataList = [];
    //     this.SelectedAddonList = [];
    //     if (this.EditionID > 0) {
    //         this.addonServiceProxy.getAddonListByEditionId(this.EditionID)
    //             .pipe().subscribe(result => {
    //                 this.ActualAddonDataList = result.items;
    //                 this.AddonDataList = result.items;
    //             });
    //     }
    // }
    GetAddonDetailsByModuleId(ModuleId) {
        this.AddonModuleDetails = null;
        this.addonServiceProxy.getAddonDetailsByModuleId(ModuleId)
            .pipe().subscribe(result => {
                this.AddonModuleDetails = result.items[0];
                this.getPricingTypes(result.items[0].pricingData);
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
        this.priceFormInvalid = this.ValidatePriceForm();
            if (!this.priceFormInvalid) {
                const input = new CreateAddonDto();
                input.productId = this.ProductId;
                input.approachId = this.ApproachId;
                input.editionID = this.AddonDataForEdit != null ?this.AddonDataForEdit.forEditionId : null;
                input.moduleId = this.AddonDataForEdit != null ?this.AddonDataForEdit.moduleId : null;
                input.addonId = this.AddonDataForEdit != null ?this.AddonDataForEdit.addonId : null;
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
    selectTab(tabId: number) {
        if (this.staticTabs?.tabs[tabId]) {
            this.staticTabs.tabs[tabId].active = true;
        }
    }
    SearchAddonModule(event) {
        let filtered: any[] = [];
        let query = event.query.trim();
        for (let i = 0; i < this.PageModuleList.length; i++) {
            let module = this.PageModuleList[i];
            if (module.displayName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(module);
            }
        }

        this.filteredPageModuleList = filtered;
    }
    AddAddonModule() {
    }
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
        this.isStandAlone = true;
        this.AddonModuleDetails = null;
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
