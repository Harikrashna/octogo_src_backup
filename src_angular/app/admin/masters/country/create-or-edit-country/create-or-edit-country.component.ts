import { CountryServiceProxy, MasterDataDto } from './../../../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateCountryInput, CommonServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ValidationServiceService } from '@app/admin/validation-service.service';
@Component({
  selector: 'app-create-or-edit-country',
  templateUrl: './create-or-edit-country.component.html',
  styleUrls: ['./create-or-edit-country.component.css']
})
export class CreateOrEditCountryComponent  extends AppComponentBase {
  @ViewChild('createOrEditCountry', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Country: CountryDto[];
  createCountry:CreateOrUpdateCountryInput = new CreateOrUpdateCountryInput()
  //createCountry:CreateOrUpdateCountryInput;
  active: boolean = false;
  saving: boolean = false; 
  edit: boolean = false;
  filteredCountries:any;
  currentCountryName;
  Currencyname: any[];
  constructor(injector: Injector, private _country: CountryServiceProxy, private _common: CommonServiceProxy,
    public _validationService: ValidationServiceService) {
    super(injector)
  }
  currencyArray: any[] = [];
  currencyResult:any[];
  continentArray:any[];
  continentResult:any[];
  iataareacodeArray:any[];
  iataareacodeResult:any[];
  airlineArray:any[];
airlineResult:any[];
masterNames = "CURRENCY, CONTINENT,IATACODE";
classificationArray:any[]=[{"id":1,"name":"AAA"},
{"id":2,"name":"BBB"},
{"id":3,"name":"CCC"},
];
classificationResult:any[];
  
  ngOnInit(): void {
    this.getMasterData();
  }
  close(form: NgForm): void {
    this.active = false;
    this.modal.hide();
    this.edit = !this.edit;
    form.resetForm();
  }
  show(e?: number): void {
    this.createCountry = new CreateOrUpdateCountryInput;
    if (e == undefined) {
      this.active = true;
      this.createCountry.sNo = null;
      this.edit = false;
      this.modal.show();
  
    }
    else {

      this.edit = true;
      this.active = true;
      this._country.getCountryForEdit(e).subscribe(res => {
        this.createCountry.sNo = res.table[0].sNo;
        this.createCountry.countryName = res.table[0].countryName;
        this.createCountry.countryCode = res.table[0].countryCode;
        this.getCurrency(null, res.table[0].currencySNo);
        this.getCurrency(null, res.table[0].currencyCode);
        this.getContinent(null, res.table[0].continent);
        this.getiataareacode(null, res.table[0].iataAreaCode);
        this.createCountry.isdCode = res.table[0].isdCode;
        this.createCountry.nationality = res.table[0].nationality;
        this.currentCountryName = res.table[0].countryName
        this.modal.show();
      })
    }
  }
  
  onShown(): void {
    document.getElementById('CountryCode').focus();
  }
  getMasterData() {
    
    this._common.getMasterData_Cache(this.masterNames).subscribe(result => {
      this.currencyArray = this.fillMasterData(result, 'CURRENCY');
      this.continentArray = this.fillMasterData(result, 'CONTINENT');
      this.iataareacodeArray = this.fillMasterData(result, 'IATACODE');
     
    });
  }

  fillMasterData(Data: MasterDataDto[], MasterName) 
  {
    if (Data != null && Data.length > 0) {
      let filteredData = Data.filter(obj => obj.masterName == MasterName);
      if (filteredData != null && filteredData != undefined && filteredData.length > 0) {
        return filteredData[0].masterData;
      }
    }
    return [];
  }

  getCurrency(e?, currencyId?) 
  {
 
    if (e != null) {
      this.currencyResult = this.currencyArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    } else if (currencyId > 0) {
      let res = this.currencyArray.filter(x => x.id == currencyId);
      if (res != null && res != undefined) {
        this.createCountry.currencySNo = res[0];
        this.createCountry.currencyCode = res[0];
      }
    }
  }
  getContinent(e?, ContinentName?)
   {
   
    if (e != null) {
      this.continentResult = this.continentArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    } else if (ContinentName != null) {
      let res = this.continentArray.filter(x => x.name == ContinentName);
      if (res != null && res != undefined) {
        this.createCountry.continent = res[0];
      }
    }
  }

  getiataareacode(e?, iataCode?) {
    if (e != null) {
      this.iataareacodeResult = this.iataareacodeArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    } else if (iataCode != null) {
      let res = this.iataareacodeArray.filter(x => x.name == iataCode);
      if (res != null && res != undefined) {
        this.createCountry.iataAreaCode = res[0];
      }
    }
  }

  save(form: NgForm,value):void{
    
   
    if (value.currencyCode != undefined || value.currencyCode != null) {
      this.createCountry.currencySNo = value.currencyCode.id;
      this.createCountry.currencyCode = value.currencyCode.code;
      
    }
    if (value.continent != undefined || value.continent != null) {
      this.createCountry.continent = value.continent.name;
    }
    if (value.iataAreaCode != undefined || value.iataAreaCode != null) {
      this.createCountry.iataAreaCode = value.iataAreaCode.name;
    }
   let Duplicacy = this.Country.filter((x) => x.countryName.trim().toUpperCase() == this.createCountry.countryName.trim().toUpperCase() || x.countryCode.trim().toUpperCase() == this.createCountry.countryCode.trim().toUpperCase());
 
   if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].sNo != this.createCountry.sNo) {
      return this.notify.warn(this.l('DuplicateCountryMessage'));
    }
     if (this.createCountry.sNo == 0 || this.createCountry.sNo == null) {
      this._country.createorUpdateCountry(this.createCountry).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._country.createorUpdateCountry(this.createCountry).subscribe(e => {
        this.notify.info(this.l('UpdateCountryMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }
  }
  
  // getAirline(e?, airlineId?) { //currency
  //   if (e != null) {
  //     this.airlineResult = this.airlineArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
  //   } else if (airlineId > 0) {
  //     let res = this.airlineArray.filter(x => x.id == airlineId);
  //     if (res != null && res != undefined) {
  //      // this.createCountry.airline = res[0];
  //     }
  //   }
  // }
  // getClassification(e?, classificationId?) { //currency
  //   if (e != null) {
  //     this.classificationResult = this.classificationArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
  //   } else if (classificationId > 0) {
  //     let res = this.classificationArray.filter(x => x.id == classificationId);
  //     if (res != null && res != undefined) {
  //      // this.createCountry.classification = res[0];
  //     }
  //   }
 // }
}

export class CountryDto{
  sNo:number;
  countryName:string;
  countryCode:string;
  isdCode:string;
  currencyCode:string;
  continent:string;
  iataAreaCode:string;
  nationality:string;
  airline: string;
  classification: string;

 }