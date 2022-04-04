import { Component, EventEmitter, Injector, OnInit, Output, QueryList, ViewChild, ViewChildren, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EditionModulesComponent } from '@app/admin/editions/edition-modules/edition-modules.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AddonServiceProxy, AvailableAddonModulesDto, CommonServiceProxy, EditionModulesDto, EditionServiceProxy, MasterDataDto, ModuleListDto, ModuleListForAddonDto, ModulePricingDto, PackageDetailsInputDto, SubModuleForAddonDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-packages-detail',
    templateUrl: './packages-detail.component.html',
    styleUrls: ['./packages-detail.component.css'],
})
export class PackagesDetailComponent extends AppComponentBase implements OnInit {
    @ViewChild('packagesDetailForm') packagesDetailForm: NgForm;
    @ViewChildren(EditionModulesComponent) editionModule: QueryList<EditionModulesComponent>;
    @Output() SelectedPackagesData = new EventEmitter();
    @Input() TenantId = 0;
    ProductList = [];
    ApproachList = [];
    EditionList = [];
    EditionID: number;
    ApproachId: number;
    ProductId: number;
    SelctedPackagesDetail: EditionProductData[] = [];
    isEdit: boolean = false;
    IsEditionFree: boolean = true;
    active = false;
    saving = false;
    SelectedIndex: number = -1;
    scrollLength = 500;
    SelectedProductIndex = -1;
    filterAddonList: AvailableAddonModulesDto[]
    constructor(
        injector: Injector, private _router: Router, private _editionService: EditionServiceProxy,
        private addonServiceProxy: AddonServiceProxy, private _commonServiceProxy: CommonServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        this._commonServiceProxy.getMasterData_Cache("PRODUCT,PRICINGAPPROACH").subscribe(result => {
            if (result != null) {
                this.ProductList = this.fillMasterData(result, 'PRODUCT');
                this.ApproachList = this.fillMasterData(result, 'PRICINGAPPROACH');
            }

        });

    }
    fillMasterData(Data: MasterDataDto[], MasterName) {
        if (Data != null && Data.length > 0) {
            let filteredData = Data.filter(obj => obj.masterName == MasterName);
            if (filteredData != null && filteredData != undefined && filteredData.length > 0) {
                return filteredData[0].masterData;
            }
        }
        return [];
    }
    SetDefaultApproach(editionId?: number) {
        let editionData = this.EditionList.filter(e => e.id == this.EditionID)
        this.IsEditionFree = editionData[0].isFree;
        this.ApproachId = editionData[0].approachId;
    }
    GetEditionList() {
        this.EditionList = []
        if (this.ProductId > 0) {
            this._editionService.getEditionsByProductId(this.ProductId, 0, "")
                .pipe().subscribe(result => {
                    this.EditionList = result.items;
                });
        }
    }
    SetDataForEdit(data: PackageDetailsInputDto[]) {
        if (data != null && data != undefined) {
            this.SelctedPackagesDetail = new Array<EditionProductData>();
            data.forEach(pkg => {
                // setTimeout(() =>{
                    this.addSubscribedEditionProductData(pkg);
                // },500)
            });
        }
    }
    addSubscribedEditionProductData(pagData: PackageDetailsInputDto) {
        this.SelctedPackagesDetail.push({
            EditionId: pagData.editionId,
            ProductId: pagData.productId,
            ApproachId: pagData.approachId,
            EditionName: pagData.editionName,
            ProductName: pagData.productName,
            IsFree: pagData.pricingTypeId > 0 ? false : true,
            ModulesFetched: false,
            SelectedAddons: [],
            EditionPricing: [],
            AddonList: [],
            IsSubscribed: true
        })
        this.SelectedProductIndex = this.SelctedPackagesDetail.length - 1;
        this.GetEditionModulesData(pagData.editionId, pagData.productId, this.SelectedProductIndex, pagData.addonSubscription)
        this.PushDataOnPaymentPage();
    }
    addEditionProductData() {
        let editionIndex = this.SelctedPackagesDetail.findIndex(e => e.ProductId == this.ProductId)
        if (editionIndex != -1 && this.EditionID != this.SelctedPackagesDetail[editionIndex].EditionId) {    // remove existing package of selected Product
            if (this.SelctedPackagesDetail[editionIndex].IsSubscribed) {
                // remove confirmation here
                this.message.confirm(
                    this.l('EditionRemoveConfirmationMsg', this.SelctedPackagesDetail[editionIndex].EditionName),
                    this.l('AreYouSure'),
                    isConfirmed => {
                        if(isConfirmed){
                        this.removeDuplicatePackage(editionIndex)
                        this.AddProduct();
                        }
                    }
                );
            }
            else{
                this.removeDuplicatePackage(editionIndex)
                this.AddProduct();
            }
        }
        else if(editionIndex == -1){
            this.AddProduct();
        }
        else{
            this.notify.warn("Duplicate");
        }
    }
    AddProduct(){
        let editionData = this.EditionList.filter(el => el.id == this.EditionID)
        let productData = this.ProductList.filter(pl => pl.id == this.ProductId)
        let approachData = this.ApproachList.filter(al => al.id == this.ApproachId)
        this.SelctedPackagesDetail.push({
            EditionId: editionData[0].id,
            ProductId: productData[0].id,
            ApproachId: approachData[0]?.id,
            EditionName: editionData[0].displayName,
            ProductName: productData[0].name,
            IsFree: editionData[0].isFree,
            ModulesFetched: false,
            SelectedAddons: [],
            EditionPricing: [],
            AddonList: [],
            IsSubscribed: false
        })
        this.SelectedProductIndex = this.SelctedPackagesDetail.length - 1;
        this.GetEditionModulesData(editionData[0].id, productData[0].id, this.SelectedProductIndex)
        this.PushDataOnPaymentPage();
    }
    x = 0; y = 0;  // these variables only used to prevent instant payment  data api calls on payment page
    PushDataOnPaymentPage() {
        this.x++;// 1,2,3,4
        setTimeout(() => {
            this.y++;//1,2,3,4
            if (this.x == this.y) {
                this.SelectedPackagesData.emit(this.SelctedPackagesDetail);
                this.x = 0;
                this.y = 0;
            }
        }, 1500)
    }
    removeDuplicatePackage(index: number, forCloseButton = false) {
        if(forCloseButton == true){
        this.message.confirm(
            this.l('EditionRemoveConfirmationMsg', this.SelctedPackagesDetail[index].EditionName),
            this.l('AreYouSure'),
            isConfirmed => {
                if(isConfirmed){
                    this.SelctedPackagesDetail.splice(index, 1);
                    this.SelectedProductIndex = this.SelctedPackagesDetail.length - 1;
                    this.PushDataOnPaymentPage();
                }
            }
        );
        }
        else{
            this.SelctedPackagesDetail.splice(index, 1);
            this.SelectedProductIndex = this.SelctedPackagesDetail.length - 1;
        }
    }
    GetEditionModulesData(EditionId, ProductId, prodIndex, subscribedAddons?) {
        if (this.SelctedPackagesDetail[prodIndex].ModulesFetched == false
            || (this.SelctedPackagesDetail[prodIndex].EditionId != EditionId && this.SelctedPackagesDetail[prodIndex].ProductId != ProductId)) {
            let timer = setInterval(() => {
                if (this.editionModule.get(prodIndex) != undefined && this.editionModule.get(prodIndex) != null) {
                    clearInterval(timer);
                    this.editionModule.get(prodIndex).PageModuleList = [];
                    this.editionModule.get(prodIndex).ModuleDataFetched = false;
                    this.editionModule.get(prodIndex).SubSubModuleList = [];
                    this.editionModule.get(prodIndex).SubModuleList = [];
                    this.editionModule.get(prodIndex).SelectedModule = null;
                    this.editionModule.get(prodIndex).SelectedIndex = -1;
                    this.editionModule.get(prodIndex).DependEditionData = [];
                    if (EditionId > 0) {
                        this._editionService.getEditionModules(EditionId).subscribe(async result => {
                            this.editionModule.get(prodIndex).ModuleDataFetched = true;
                            if (result != null) {
                                this.SelctedPackagesDetail[prodIndex].ModulesFetched = true;
                                this.editionModule.get(prodIndex).DependEditionData = result.dependEditionData;
                                this.editionModule.get(prodIndex).SetModuleDataForEdit(result.modulesData, ProductId);
                            }
                        });
                    }
                }
            }, 50)
            this.getEditionPricingData(EditionId, prodIndex)
            this.GetAvailableAddonBySubscribedEditionId(EditionId, prodIndex, subscribedAddons);
        }
    }
    getEditionPricingData(editionID: number, prodIndex) {
        this._editionService.getEditionDetailsForEdit(editionID).subscribe(result => {
            this.SelctedPackagesDetail[prodIndex].EditionPricing = result.pricingData
        })
    }

    SelectPackageCardData(index: number) {
        this.SelectedProductIndex = index;
        this.SelctedPackagesDetail[index]["selected"] = true;
    }
    GetAvailableAddonBySubscribedEditionId(editionId: number, prodIndex, subscribedAddons?): void {
        this.SelctedPackagesDetail[prodIndex].AddonList = new Array<AvailableAddonModulesDto>();

        this.addonServiceProxy.getAddonListByEditionId(editionId)
            .subscribe(result => {
                this.SelctedPackagesDetail[prodIndex].AddonList = result;
                if (subscribedAddons != null && subscribedAddons != undefined) { /// for Edit mode
                    subscribedAddons.forEach(adn => {
                        let index = this.SelctedPackagesDetail[prodIndex].AddonList.findIndex(f => f.addonId == adn.addonId)
                        this.selectAddons(index, adn.addonId, prodIndex, true)
                    });
                }
            })
    }

    selectAddons(index: number, addonId: number, prodIndex, isSubscribed: boolean = false) {
        this.CheckAndRemoveDuplicateAddonSelection(addonId,prodIndex);
        this.SelctedPackagesDetail[prodIndex].AddonList[index]["selected"] = true;
        if (this.SelctedPackagesDetail[prodIndex].SelectedAddons == null || this.SelctedPackagesDetail[prodIndex].SelectedAddons == undefined) {
            this.SelctedPackagesDetail[prodIndex].SelectedAddons = new Array<SelectedAddons>();
        }
        let tempIndex = this.SelctedPackagesDetail[prodIndex].SelectedAddons.findIndex(f => f.AddonId == addonId);
        if (tempIndex == -1) {
            let addon = new SelectedAddons();
            addon.AddonId = this.SelctedPackagesDetail[prodIndex].AddonList[index].addonId,
            addon.AddonName = this.SelctedPackagesDetail[prodIndex].AddonList[index].addonName
            addon.IsSubscribed = isSubscribed;
            this.SelctedPackagesDetail[prodIndex].SelectedAddons.push(addon);
            this.PushDataOnPaymentPage();
        }
    }
    CheckAndRemoveDuplicateAddonSelection(addonId,prodIndex?){
        this.SelctedPackagesDetail.forEach(pkg =>{
            if(!(prodIndex >= 0)){          // if addon already subscribed(in edit mode)- calls on Page Load
                let addonIndex = pkg.AddonList.findIndex(f => f.addonId == addonId);
                if(addonIndex >= 0){
                    pkg.AddonList[addonIndex]["hideAddon"] = false;
                }
            }
            else if(pkg.AddonList != null && pkg.AddonList != undefined && pkg.EditionId != this.SelctedPackagesDetail[prodIndex].EditionId)
            {
                let addonIndex = pkg.AddonList.findIndex(f => f.addonId == addonId);
                if(addonIndex >= 0){
                    pkg.AddonList[addonIndex]["hideAddon"] = true;
                }
            }
        });
    }
    removeSelectedAddon(index: number, addonId: number, prodIndex) {
        let addonIndex = this.SelctedPackagesDetail[prodIndex].SelectedAddons.findIndex(fi => fi.AddonId == addonId)
        if (addonIndex != -1 && this.SelctedPackagesDetail[prodIndex].SelectedAddons[addonIndex].IsSubscribed == true) {
            // confirmation Msg
            this.message.confirm(
                this.l('AddonRemoveConfirmationMsg', this.SelctedPackagesDetail[prodIndex].AddonList[index].addonName),
                this.l('AreYouSure'),
                isConfirmed => {
                    if (isConfirmed) {
                        this.SelctedPackagesDetail[prodIndex].AddonList[index]["selected"] = false;
                        this.CheckAndRemoveDuplicateAddonSelection(addonId);
                        if (addonIndex != -1) {
                            this.SelctedPackagesDetail[prodIndex].SelectedAddons.splice(addonIndex, 1)
                        }
                        this.PushDataOnPaymentPage();
                    }
                }
            );
        }
        else {
            this.SelctedPackagesDetail[prodIndex].AddonList[index]["selected"] = false;
            this.CheckAndRemoveDuplicateAddonSelection(addonId);
            if (addonIndex != -1) {
                this.SelctedPackagesDetail[prodIndex].SelectedAddons.splice(addonIndex, 1)
            }
            this.PushDataOnPaymentPage();
        }

    }
    radioButtonHandler(event) {
        // this.seletedRadio = event.target.value;
    }
    CheckValidModulesData() {
        let InvalidProductIndex = -1;
        if (this.SelctedPackagesDetail != null && this.SelctedPackagesDetail.length > 0) {
            for (let i = 0; i < this.SelctedPackagesDetail.length; i++) {
                let selectedModules = this.editionModule.get(i).PageModuleList.filter(obj => obj["selected"] == true);
                if (selectedModules != null && selectedModules != undefined && selectedModules.length > 0) {
                    InvalidProductIndex = this.CheckValidModuleSubModule(selectedModules, i);
                }
                else {
                    InvalidProductIndex = i;
                    break;
                }
            }
        }
        return InvalidProductIndex;
    }
    GetDataToInsert(): PackageDetailsInputDto[] {
        let data = new Array<PackageDetailsInputDto>();
        for (let i = 0; i < this.SelctedPackagesDetail.length; i++) {
            let pkg = new PackageDetailsInputDto();
            pkg.productId = this.SelctedPackagesDetail[i].ProductId;
            pkg.editionId = this.SelctedPackagesDetail[i].EditionId;
            pkg.approachId = this.SelctedPackagesDetail[i].ApproachId;
            // pkg.waitAfterExpiry = this.SelctedPackagesDetail[i].
            // pkg.waitingDays = this.SelctedPackagesDetail[i].
            // pkg.assignAnotherPackage= this.SelctedPackagesDetail[i].
            // pkg.assignPackageId = this.SelctedPackagesDetail[i].
            pkg.moduleList = this.GetModulesData(i);
            data.push(pkg);
        }
        return data;
    }
    GetModulesData(prodIndex) {
        let selectedModules = [];
        let modulesData = new Array<ModuleListDto>();
        if (this.editionModule.get(prodIndex) != undefined && this.editionModule.get(prodIndex).PageModuleList != null && this.editionModule.get(prodIndex).PageModuleList.length > 0) {
            debugger
            selectedModules = this.editionModule.get(prodIndex).PageModuleList.filter(obj => obj["selected"] == true);
            selectedModules.forEach(element => {
                modulesData.push(new ModuleListDto({
                    editionModuleId: element["editionModuleId"],
                    moduleName: element.displayName,
                    subModuleList: this.fillSubModuleDataToInsert(element.id, prodIndex),
                    pageModuleId: element.id
                }));
            });

            // pop module data if no subModule selected
            let modulesToPop = modulesData.filter(x => !(x.subModuleList != null && x.subModuleList != undefined && x.subModuleList.length > 0));
            if (modulesToPop != null && modulesToPop != undefined && modulesToPop.length > 0) {
                modulesToPop.forEach(mod => {
                    let index = modulesData.findIndex(x => x.pageModuleId == mod.pageModuleId);
                    modulesData.splice(index, 1);
                })
            }
        }
        return modulesData;
    }
    fillSubModuleDataToInsert(pageModuleId, prodIndex) {
        let subModuleIndex = this.editionModule.get(prodIndex).PageSubModuleList.findIndex(obj => obj.moduleId == pageModuleId);
        if (subModuleIndex >= 0) {
            let selectedSubModules = this.editionModule.get(prodIndex).PageSubModuleList[subModuleIndex].subModuleList.filter(obj => obj["selected"] == true);
            if (selectedSubModules != null && selectedSubModules.length > 0) {
                let subModules = new Array<ModuleListDto>();
                selectedSubModules.forEach(element => {
                    subModules.push(new ModuleListDto(
                        {
                            editionModuleId: element["subModuleId"],
                            moduleName: element.displayName,
                            subModuleList: this.fillSubSubModuleDataToInsert(element.subSubModuleList),
                            pageModuleId: element.id
                        }
                    ));
                })
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
                            editionModuleId: element["subModuleId"],
                            moduleName: element.displayName,
                            subModuleList: null,
                            pageModuleId: element.id
                        }
                    ));
                }
            })
            return subModules;
        }
        return null;
    }
    CheckValidModuleSubModule(selectedModules, prodIndex) {
        let InValidModulesProductIndex = prodIndex;

        if (selectedModules != null && selectedModules.length > 0) {
            for (let i = 0; i < selectedModules.length; i++) {
                let subModule = this.editionModule.get(prodIndex).PageSubModuleList.filter(x => x.moduleId == selectedModules[i].id);
                if (subModule != null && subModule.length > 0 && subModule[0].subModuleList != null && subModule[0].subModuleList.length > 0) {
                    let selectedSubModule = subModule[0].subModuleList.filter(obj => obj["selected"] == true);
                    if (selectedSubModule != null && selectedSubModule != undefined && selectedSubModule.length > 0) {
                        InValidModulesProductIndex = -1;
                        selectedSubModule.forEach(subModule1 => {
                            if (subModule1.subSubModuleList != null && subModule1.subSubModuleList != undefined) {
                                let selectedSubSubModIndex = subModule1.subSubModuleList.findIndex(x => x["selected"] == true);
                                if (selectedSubSubModIndex < 0) {
                                    InValidModulesProductIndex = prodIndex;
                                }
                            }
                        })
                    }
                }
                else {
                    InValidModulesProductIndex = prodIndex;
                    break;
                }
                // check current selected module and Sub-modules
                if (this.editionModule.get(prodIndex).SelectedModule != null && this.editionModule.get(prodIndex).SelectedModule != undefined && this.editionModule.get(prodIndex).SelectedModule.id > 0) {
                    let flag = 0;
                    this.editionModule.get(prodIndex).SubModuleList.forEach(sModule => {
                        if (sModule["selected"] == true) {
                            if (flag == 0) InValidModulesProductIndex = -1;
                            if (sModule.subSubModuleList != null && sModule.subSubModuleList != undefined && sModule.subSubModuleList.length > 0) {
                                let tempIndex = sModule.subSubModuleList.findIndex(y => y["selected"] == true);
                                if (tempIndex < 0) {
                                    InValidModulesProductIndex = prodIndex;
                                    flag++;
                                }
                            }
                        }
                    });
                }
            }
        }
        return InValidModulesProductIndex;
    }
}
class EditionProductData {
    ProductId?: number;
    EditionId?: number;
    ApproachId?: number;
    ProductName: string;
    EditionName: string;
    IsFree: boolean;
    ModulesFetched: boolean;
    SelectedAddons: SelectedAddons[] = [];
    EditionPricing: ModulePricingDto[] = [];
    AddonList: AvailableAddonModulesDto[] = [];
    IsSubscribed: boolean = false
}
export class SelectedAddons {
    AddonId: number;
    AddonName: string;
    IsSubscribed: boolean = false;
}
