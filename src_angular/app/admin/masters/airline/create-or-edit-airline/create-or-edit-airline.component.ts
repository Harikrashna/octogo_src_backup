import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm, PatternValidator } from '@angular/forms';
import { AirlineServiceProxy, CreateOrUpdateAirlineInput } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-or-edit-airline',
  templateUrl: './create-or-edit-airline.component.html',
  styleUrls: ['./create-or-edit-airline.component.css']
})
export class CreateOrEditAirlineComponent extends AppComponentBase {
    @ViewChild('createOrEditAirline', { static: true }) modal: ModalDirective;
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
  imageUrl
  ngOnInit() {
    this.imageUrl = 'data:image/svg;base64,' + "aHR0cHM6Ly9nYXJlc3N0b3JhZ2UuYmxvYi5jb3JlLndpbmRvd3MubmV0L2NmcmVzY29udGFpbmVyLzRfbWFyXzIwMTlfMDg6NTM6MDdfNzVfX2dhdXJkYWNtc19sb2dvLmpwZw==";
  }
  
  close(form: NgForm): void {
    this.active = false;
    this.modal.hide();
    this.edit = !this.edit;
    form.resetForm();
  }
  onUpload(event): void {
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }
}
onChange(event, data) {
    if (event.target.checked) {
      this.isChecked = !this.isChecked;
      console.log(data.id)
      this.createAirline.isCheckModulus7 = data.id
    }
    else {
      this.createAirline.isCheckModulus7 = null;

    }
  }

onInterline(event,data){
    if (event.target.checked) {
        this.isChecked = !this.isChecked;
        console.log(data.id)
        this.createAirline.isInterline = data.id
      }
      else {
        this.createAirline.isInterline = null;

      }
}
onInvoiceGeneration(event,data){
    if (event.target.checked) {
        this.isChecked = !this.isChecked;
        console.log(data.id)
        this.createAirline.isInvoiceGeneration = data.id
      }
      else {
        this.createAirline.isInvoiceGeneration = null;

      }
}

onCCShipment(event,data){
    if (event.target.checked) {
        this.isChecked = !this.isChecked;
        console.log(data.id)
        this.createAirline.isCCShipment = data.id
      }
      else {
        this.createAirline.isCCShipment = null;

      }
}

onPartShipment(event,data){
    if (event.target.checked) {
        this.isChecked = !this.isChecked;
        console.log(data.id)
        this.createAirline.isPartShipment = data.id
      }
      else {
        this.createAirline.isPartShipment = null;

      }
}
onfsu(event,data){
    if (event.target.checked) {
        this.isChecked = !this.isChecked;
        console.log(data.id)
        this.createAirline.isFSUTime = data.id
      }
      else {
        this.createAirline.isFSUTime = null;

      }
}
onffm(event,data){
    if (event.target.checked) {
        this.isChecked = !this.isChecked;
        console.log(data.id)
        this.createAirline.isIncludeInFFM = data.id
      }
      else {
        this.createAirline.isIncludeInFFM = null;

      }
}
onactive(event, data) {
    if (event.target.checked) {
      this.isChecked = !this.isChecked;
      console.log(data.id)
      this.createAirline.isActive = data.id
    }
    else {
      this.createAirline.isActive = null;

    }
  }
onBeforeSend(event): void {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + abp.auth.getToken());
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
  validations(event: any) {
    if (event.target.selectionStart == 0 && event.keyCode == 32 || event.keyCode >=104 && event.keyCode<=222) {
      return false;
    }
  }
  onShown(): void {
    document.getElementById('AirlineName').focus();
  }

  save(form: NgForm):void{

    let Duplicacy = this.Airline.filter((x) => x.vcAirlineName.toUpperCase() == this.createAirline.vcAirlineName.toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inAirlineID != this.createAirline.inAirlineID) {
      return this.notify.warn(this.l('DuplicateAirlineMessage'));
    }
    else if (this.createAirline.inAirlineID == 0 || this.createAirline.inAirlineID == null) {
      this._Airline.createorUpdateAirline(this.createAirline).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._Airline.createorUpdateAirline(this.createAirline).subscribe(e => {
        this.notify.info(this.l('UpdateAirlineMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
  }

  filterCountry(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.countries.length; i++) {
        let country = this.countries[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredCountries = filtered;
}
filterairport(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.airports.length; i++) {
        let airport = this.airports[i];
        if (airport.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(airport);
        }
    }

    this.filteredAirport = filtered;
}
}
export class AirlineDto{
    inAirlineID:number;
    vcAirlineName:string;
    vcDescription:string;
  }

