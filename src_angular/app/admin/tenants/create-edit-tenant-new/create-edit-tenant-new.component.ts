import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CreateEditTenantInputDto, InvoiceDataInputDto, SubscriptionStartType, TenantBillingSettingsEditDto, TenantServiceProxy, TenantSettingsEditDto, TransactionDataInputDto } from '@shared/service-proxies/service-proxies';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { TransactionalChargesComponent } from './transactional-charges/transactional-charges.component';
import { TenantDetailsComponent } from './tenant-details/tenant-details.component';
import { PackagesDetailComponent } from './packages-detail/packages-detail.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-tenant-new',
  templateUrl: './create-edit-tenant-new.component.html',
  styleUrls: ['./create-edit-tenant-new.component.css']
})
export class CreateEditTenantNewComponent extends AppComponentBase {
  @ViewChild('createOrEditTenant', { static: true }) modal: ModalDirective;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @ViewChild('tenantDetails') TenantDetails: TenantDetailsComponent;
  @ViewChild('packagesDetail') PackagesDetail: PackagesDetailComponent;
  @ViewChild('paymentDetail') PaymentDetail: PaymentDetailsComponent;
  @ViewChild('transactionalCharges') TransactionalCharges: TransactionalChargesComponent;
 // @ViewChild('LegalNameInput', { static: false }) nameInput: ElementRef;
  @Output() formClose = new EventEmitter();
  @Input() TenantId = 0;
  @Input() viewForm :boolean =false;
  @Input() editForm:boolean;
  active = false;
  saving = false;
  EditData: CreateEditTenantInputDto;
  //settings: TenantSettingsEditDto =  new TenantSettingsEditDto();
  InvoiceDetails:InvoiceDataInputDto = new InvoiceDataInputDto() //Added by:Merajuddin
 

  TransactionalChargesInput: TransactionDataInputDto;
  TransactionalChargesData: TransactionDataInputDto = new TransactionDataInputDto();
  SelectedPackagesData = [];
  constructor(
    injector: Injector,
    private _tenantAppService: TenantServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // If page open in Edit mode
    //this.settings.billing = new TenantBillingSettingsEditDto()
    if (this.TenantId > 0) {
      this.EditData = new CreateEditTenantInputDto();
      this._tenantAppService.getTenantDetailsForEdit(this.TenantId)
        .subscribe(result => {
          if (result != null) {
            this.EditData = result;
            if(this.EditData.tenantDetails != null && this.EditData.tenantDetails != undefined){
              this.TenantDetails.SetDataForEdit(this.EditData.tenantDetails);
              
            }
           
            else{
              this.TenantDetails.GetMastersData();
            }
            if(this.EditData.packageDetails != null && this.EditData.packageDetails != undefined){
              this.PackagesDetail.SetDataForEdit(this.EditData.packageDetails);
              if(this.EditData.tenantDetails.userTypeID > 0){
                this.PackagesDetail.GetProduclistByUserTypeId(this.EditData.tenantDetails.userTypeID)  
              }
              this.PaymentDetail.PackagesDataForEdit = this.EditData.packageDetails;
              this.PaymentDetail.IsEdit = true;
            }
            if(this.EditData.transactionCharges != null && this.EditData.transactionCharges != undefined){
              this.TransactionalCharges.approachId = this.EditData.transactionCharges.approachId;
              this.TransactionalCharges.AWBData = this.EditData.transactionCharges.awbData;
            }     
            if(this.EditData.invoiceData != null && this.EditData.invoiceData != undefined) //Added by:Merajuddin
            {
              //A loop is added here to prevent the assign incorrect data if order of 'this.EditData.invoiceData.name' will be changed.
              for(var i = 0; i < this.EditData.invoiceData.length; i++) 
              {
                if(this.EditData.invoiceData[i].name.toUpperCase() == 'App.TenantManagement.BillingLegalName'.toUpperCase())
                {
                  this.InvoiceDetails.legalName = this.EditData.invoiceData[i].value
                }
                if(this.EditData.invoiceData[i].name.toUpperCase() == 'App.TenantManagement.BillingAddress'.toUpperCase())
                {
                  this.InvoiceDetails.address = this.EditData.invoiceData[i].value
                }
                if(this.EditData.invoiceData[i].name.toUpperCase() == 'App.TenantManagement.BillingTaxVatNo'.toUpperCase())
                {
                  this.InvoiceDetails.taxVatNo = this.EditData.invoiceData[i].value
                }
              }
            }      
          }
        })
    }
  }


  save() {
    let input = new CreateEditTenantInputDto();
    if (this.TenantDetails.CheckValidData() == true) {      // Check valid Tenant Details
      let InvalidModulesProductIndex = this.PackagesDetail.CheckValidModulesData(); // Check valid Packages  and Module Details
      if (InvalidModulesProductIndex == -1 && this.PackagesDetail.SelctedPackagesDetail != null && this.PackagesDetail.SelctedPackagesDetail.length > 0) {
        if (this.PaymentDetail.CheckValidData() == true) {      // Check valid payment Details
          if (this.TransactionalCharges.CheckValidData() == true)  // Check valid Transactional Data
          {
            input.tenantDetails = this.TenantDetails.GetDataToInsert();   // Get Tenant Details data to Insert
            input.tenantDetails.tenantId = this.TenantId
            input.packageDetails = this.PackagesDetail.GetDataToInsert();   // Get Packages data to Insert
            input.invoiceDetails = this.InvoiceDetails //Added by:Merajuddin
            input.packageDetails.forEach(pkg => {
              let payments = this.PaymentDetail.GetDataToInsert(pkg.editionId);
              pkg.pricingTypeId = payments["pricingTypeId"];
              pkg.amount = payments["amount"];
              pkg.paymentModeCode = payments.paymentModeCode;
              pkg.discountPercentage = payments.discountPercentage;
              pkg.paymentType = payments["paymentType"];
              pkg.paymentDone = false
              pkg.addonSubscription = payments["addonSubscription"];
            })
            input.transactionCharges = this.TransactionalCharges.GetDataToInsert();   // Get Transactional Data
            this.saving = true;
            this._tenantAppService.createUpdateTenantNew(input)
              .pipe(finalize(() => { this.saving = false;}))
              .subscribe(result => {
                this.saving = false;
                if(result > 0){
                  this.notify.info(this.l('SavedSuccessfully'));
                  this.formClose.emit(true);
                }
                else{
                  this.notify.warn(this.l('SomthingWrong'));
                }
              })
          }
          else {
            this.selectTab(3);
          }
        }
        else {
          this.selectTab(2);
        }
      }
      else {
        this.selectTab(1);
        this.PackagesDetail.SelectedProductIndex = InvalidModulesProductIndex;
      }
    }
    else {
      this.selectTab(0);
    }
  }
  selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }
  Cancel(): void {
    this.active = false;
    this.viewForm=false;
    this.formClose.emit(false);
  }
  GetSelectedPackagesData(data) {
    this.SelectedPackagesData = data;
    this.PaymentDetail.GetPackageAndAddonDetails(this.SelectedPackagesData);
  }
  GetUserTypeId(userTypeId:number){
    this.PackagesDetail.GetProduclistByUserTypeId(userTypeId) 
  }

}

