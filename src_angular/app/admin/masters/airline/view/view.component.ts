import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AirlineServiceProxy, CreateOrUpdateAirlineInput } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AirlineDto } from '../create-or-edit-airline/create-or-edit-airline.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent extends AppComponentBase {
  @ViewChild('viewAirline', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Airline: AirlineDto[];
  createAirline: CreateOrUpdateAirlineInput=new CreateOrUpdateAirlineInput;
  active: boolean = false;
  saving: boolean = false;
  edit: boolean = false;
  currentAirlineName;
  currentCarrierCode;
  currentICAOCode;
  currentCountryName;
  currentHandlingInformation;
  currentInterline;
  currentAWBDuplicacy;
  currentCheckModulus7;
  currentFaxNo;
  currentPhoneNo;
  currentMobileNo;
  currentContactPerson;
  currentAirlineWebsite;
  currentAirport;
  currentCCShipment;
  currentPartShipment;
  selectedCategories: any[];
  uploadedFiles: any[] = [];
  countries: any[];
  airports:any[]

  uploadUrl: string;
  CheckModulus7:boolean;
  filteredCountries: any[];
  filteredAirport:any[];
  isChecked;
isCheckedName;
  usertypes = [
  { id: 1, name: "Yes" },
  { id: 2, name: "No" },

];
invoices=[
  { id: 1, name: "Consolidator" },
  { id: 2, name: "Branch Wise" },
]
fsu=[
  { id: 1, name: "GMT" },
  { id: 2, name: "Local" },
]
ffm=[
  { id: 1, name: "Courier Baggage Vochuer" },
  { id: 2, name: "Courier" },
]

  constructor(injector: Injector, private _Airline: AirlineServiceProxy,) { super(injector)}

  ngOnInit(): void {
  }
  close(form: NgForm): void {
    this.active = false;
    this.modal.hide();
    this.edit = !this.edit;
    form.resetForm();
  }

  show(inAirlineID?: number): void {
    debugger
    
       // this.createAirline = new CreateOrUpdateAirlineInput;
        // if (inAirlineID == undefined) {
        //   this.active = true;
        //   this.createAirline.inAirlineID = null;
        //   this.modal.show();
        // }
          console.log(this.Airline)
          this.active = true;
          this.edit = true;
          this._Airline.getAirlineForEdit(inAirlineID).subscribe(res => {
            this.createAirline.inAirlineID = res.table[0].sNo;
            this.createAirline.vcAirlineName = res.table[0].airlineName;
           // this.createAirline.vcAWBPrifix = res.table[0].awbPrifix;
            this.createAirline.vcCarrierCode = res.table[0].carrierCode;
            this.createAirline.vcICAOCode = res.table[0].icaoCode;
            this.createAirline.vcCountryName = res.table[0].countryName;
            this.createAirline.vcAirport = res.table[0].airportCode;
           // this.createAirline.vcRegisteredAddress = res.table[0].registeredAddress;
            this.createAirline.vcAirlineWebsite = res.table[0].airlineWebsite;
            this.createAirline.vcContactPerson = res.table[0].contactPerson;
            this.createAirline.vcMobileNo = res.table[0].mobileNo;
            this.createAirline.vcPhoneNo = res.table[0].phoneNo;
            this.createAirline.vcFaxNo = res.table[0].faxNo;
            this.createAirline.isCheckModulus7 = res.table[0].isCheckModulus7;
            this.createAirline.vcAWBDuplicacy = res.table[0].awbDuplicacy;
            this.createAirline.vcHandlingInformation = res.table[0].handlingInformation;
            this.createAirline.isInterline = res.table[0].isInterline;
            // this.createAirline.isInvoiceGeneration = res.table[0].invoiceGeneration;
            this.createAirline.isCCShipment = res.table[0].isCCAllowed;
            this.createAirline.isPartShipment = res.table[0].isPartAllowed;
            // this.createAirline.isFSUTime = res.table[0].fsuTime;
            // this.createAirline.isIncludeInFFM = res.table[0].includeInFFM;
            // this.createAirline.vcCIMPGrossWeight = res.table[0].cimpGrossWeight;
            // this.createAirline.vcCIMPCBM = res.table[0].cimpcbm;
            this.createAirline.isActive = res.table[0].isActive;
            this.createAirline.vcAWBLogo = res.table[0].awbLogo;
            this.createAirline.vcAirlineLogo = res.table[0].airlineLogo;
    
            this.currentAirlineName = res.table[0].airlineName;
            this.currentCarrierCode=res.table[0].carrierCode;
            this.currentICAOCode = res.table[0].icaoCode;
            this.currentCountryName = res.table[0].countryName;
            this.currentAirport = res.table[0].airportCode;
            this.currentAirlineWebsite = res.table[0].airlineWebsite;
            this.currentContactPerson = res.table[0].contactPerson;
            this.currentMobileNo = res.table[0].mobileNo;
            this.currentPhoneNo = res.table[0].phoneNo;
            this.currentFaxNo = res.table[0].faxNo;
            this.currentCheckModulus7 = res.table[0].isCheckModulus7;
            this.currentAWBDuplicacy = res.table[0].awbDuplicacy;
            this.currentHandlingInformation = res.table[0].handlingInformation;
            this.currentInterline = res.table[0].isInterline;
            this.currentCCShipment = res.table[0].isCCAllowed;
            this.currentPartShipment = res.table[0].isPartAllowed;
            this.modal.show();
          })
        
      }
      onShown(): void {
        document.getElementById('AirlineName').focus();
      }
}
