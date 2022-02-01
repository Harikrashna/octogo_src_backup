
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { CityListDto, CityServiceProxy, CommonServiceProxy, CreateOrUpdateCityInput, MasterDataDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-or-edit-city',
  templateUrl: './create-or-edit-city.component.html',
  styleUrls: ['./create-or-edit-city.component.css'],

})
export class CreateOrEditCityComponent extends AppComponentBase implements OnInit {

  @ViewChild('createOrEditCity', { static: true }) modal: ModalDirective;
  @ViewChild('CityForm') CityForm: NgForm;
  @Input() perCity: CityListDto[]
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  createCity: CreateOrUpdateCityInput;

  CityComponent: any;

  active = false;
  isActive: boolean;
  priorApproval: boolean; 
  isDayLightSaving: boolean; 
  saving = false;
  isEdit = false;
  cityName = '';
  country: any[];
  abc: any;
  Duplicacy: boolean;

  countryArray: any[] = [];
  countryResult: any[];
  stateArray: any[] = [];
  stateResult: any[];
  timezoneArray: any[] = [];
  timezoneResult: any[];
  zoneArray: any[] = [];
  zoneResult: any[];
  iataareacodeArray: any[] = [];
  iataareacodeResult: any[];
  shcArray: any[];
  shcResult: any[];
  dgclassArray: any[];
  dgclassResult: any[];
  masterNames:string;

  constructor(injector: Injector, private _cityService: CityServiceProxy, private _common: CommonServiceProxy,public _validationService: ValidationServiceService) {
    super(injector)
    this.createCity = new CreateOrUpdateCityInput();
  }

  ngOnInit(): void {
    this.masterNames = "ZONE,COUNTRY,TIMEZONE,STATE,SHC,DGCLASS,IATACODE";
    this.getMasterData();
  }

  init(): void {
    this.createCity.isActive = true;
    this.createCity.priorApproval = false;
    this.createCity.isDayLightSaving = false;
  }

  getMasterData() {
    this._common.getMasterData_Cache(this.masterNames).subscribe(result => {
      this.countryArray = this.fillMasterData(result, 'COUNTRY');
      this.zoneArray = this.fillMasterData(result, 'ZONE');
      this.timezoneArray = this.fillMasterData(result, 'TIMEZONE');
      this.stateArray = this.fillMasterData(result, 'STATE');
      this.shcArray = this.fillMasterData(result, 'SHC');
      this.dgclassArray = this.fillMasterData(result, 'DGCLASS');
      this.iataareacodeArray = this.fillMasterData(result, 'IATACODE');
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

  show(sNo?: number): void {
    if (sNo == undefined) {
      this.active = true;
      this.init();
      this.isEdit = false;
      this.modal.show();
    }
    else {
      this.active = true;
      this.isEdit = true;
      this._cityService.getCityForEdit(sNo).subscribe(response => {
        this.createCity.sNo = response.table[0].sNo;
        this.createCity.cityCode = response.table[0].cityCode;
        this.createCity.cityName = response.table[0].cityName;
        this.createCity.isDayLightSaving = response.table[0].isDayLightSaving;
        this.getCountry(null, response.table[0].countrySNo);
        this.getTimeZone(null, response.table[0].timeZoneSNo);
        this.getZone(null, response.table[0].zoneSNo);
        this.getShc(null, response.table[0].shcSNo);
        this.getDgClass(null, response.table[0].dgClassSNo);
        this.getIataAreaCode(null, response.table[0].iataAreaCode);
        this.getState(null, response.table[0].stateSNo);
        this.createCity.priorApproval = response.table[0].priorApproval;
        this.createCity.isActive = response.table[0].isActive;
        this.cityName = response.table[0].cityName;
        this.modal.show();
      })
    }
  }
  save(form, values): void {
    this.Duplicacy = this.perCity.some((x) => x.cityName.trim().toUpperCase() == this.createCity.cityName.trim().toUpperCase() && x.cityCode.trim().toUpperCase() == this.createCity.cityCode.trim().toUpperCase() && x.countryName == values.countryName.name && x.sNo != this.createCity.sNo || (x.cityName.trim().toUpperCase() == this.createCity.cityName.trim().toUpperCase() || x.cityCode.trim().toUpperCase() == this.createCity.cityCode.trim().toUpperCase()) && x.sNo != this.createCity.sNo);
    if (this.Duplicacy) {
      this.notify.warn(this.l('DuplicateMessage'));
      return;
    }
    if (values.countryName != undefined || values.countryName != null) {
      this.createCity.countryName = values.countryName.name;
      this.createCity.countrySNo = values.countryName.id;
      this.createCity.countryCode = values.countryName.code;
    }
    if (values.timezoneName != undefined || values.timezoneName != null) {
      this.createCity.timeZoneSNo = values.timezoneName.id;
    }
    if (values.dgclass != undefined || values.dgclass != null) {
      this.createCity.dgClassSNo = values.dgclass.id;
    }
    if (values.shc != undefined || values.shc != null) {
      this.createCity.shcSNo = values.shc.id;
    }
    if (values.iataAreaCode != undefined || values.iataAreaCode != null) {
      this.createCity.iataAreaCode = values.iataAreaCode.id;
    }
    if (values.zone != undefined || values.zone != null) {
      this.createCity.zoneSNo = values.zone.id;
      this.createCity.zoneName = values.zone.name
    }
    if (values.stateName != undefined || values.stateName != null) {
      this.createCity.stateName = values.stateName.name;
      this.createCity.stateSNo = values.stateName.id
    }

    if (this.createCity.sNo == null || this.createCity.sNo == 0) {
      this._cityService.createOrUpdateCityType(this.createCity).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form)
        this.modalSave.emit(null);
      })
    }

    else {
      this._cityService.createOrUpdateCityType(this.createCity).subscribe(e => {
        this.notify.info(this.l('Updated'));
        this.close(form)
        this.modalSave.emit(null);
      })
    }
  }
  
  onShown(): void {
    document.getElementById('cityName').focus();
  }

  close(form: NgForm): void {
    this.active = false;
    this.createCity.sNo = null;
    this.modal.hide();
    form.resetForm();
  }

  getState(e?, stateId?) {
    if (e != null) {
      this.stateResult = this.stateArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    } else if (stateId > 0) {
      let res = this.stateArray.filter(x => x.id == stateId);
      if (res != null && res != undefined) {
        this.createCity.stateSNo = res[0];
      }
    }
  }
  getTimeZone(e?, timezoneId?) {
    if (e != null) {
      this.timezoneResult = this.timezoneArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    }
    else if (timezoneId > 0) {
      let res = this.timezoneArray.filter(x => x.id == timezoneId);
      if (res != null && res != undefined) {
        this.createCity.timeZoneSNo = res[0];
      }
    }
  }
  getZone(e?, zoneId?) {
    if (e != null) {
      this.zoneResult = this.zoneArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    }
    else if (zoneId > 0) {
      let res = this.zoneArray.filter(x => x.id == zoneId);
      if (res != null && res != undefined) {
        this.createCity.zoneSNo = res[0];
      }
    }
  }
  getIataAreaCode(e?, iataAreaCodeId?) {
    if (e != null) {
      this.iataareacodeResult = this.iataareacodeArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    }
    else if (iataAreaCodeId > 0) {
      let res = this.iataareacodeArray.filter(x => x.id == iataAreaCodeId);
      if (res != null && res != undefined) {
        this.createCity.iataAreaCode = res[0];
      }
    }
  }
  getShc(e?, shcId?) {
    if (e != null) {
      this.shcResult = this.shcArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    }
    else if (shcId > 0) {
      let res = this.shcArray.filter(x => x.id == shcId);
      if (res != null && res != undefined) {
        this.createCity.shcSNo = res[0];
      }
    }
  }
  getDgClass(e?, dgclassId?) {
    if (e != null) {
      this.dgclassResult = this.dgclassArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    }
    else if (dgclassId > 0) {
      let res = this.dgclassArray.filter(x => x.id == dgclassId);
      if (res != null && res != undefined) {
        this.createCity.dgClassSNo = res[0];
      }
    }
  }
  getCountry(e?, countryId?) {
    if (e != null) {
      this.countryResult = this.countryArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    }
    else if (countryId > 0) {
      let res = this.countryArray.filter(x => x.id == countryId);
      if (res != null && res != undefined) {
        this.createCity.countrySNo = res[0];
      }
    }
  }
}