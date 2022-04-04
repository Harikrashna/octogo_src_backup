import { RegisterModel } from '@account/register/register.model';
import { InputValidationService } from '@account/shared/input-validation.service';
import { Component, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonServiceProxy, MasterDataDto, PasswordComplexitySetting, ProfileServiceProxy, TenantDetailsInputDto } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.css']
})
export class TenantDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild('tenantDetailsForm') tenantDetailsForm: NgForm;
  @Input()TenantId = 0;
  isChecked: boolean = false
  UserTypelist: any = [];
  UserType: AutoComplete;
  servicesArray: any[] = [];
  servicesResult: any[];
  countryArray: any[] = [];
  countryResult: any[];
  countryCodeArray: any[] = []
  countryCodeResult: any[];
  departmentNameArray: any[] = [];
  departmentResult: any[];
  cityList: any[] = [];
  cityCodeResult: any;
  designationNameArray: any[] = [];
  designationResult: any[]
  representingCountriesResult: any[];
  representingAirlinesArray: any[] = [];
  representingAirlinesResult: any[];
  selectedIndustry: string = null;
  selectedService: string = null;
  airlineNameArray: any[] = [];
  airlineResult: any[];
  representingCountriesArray: any[] = [];
  industryNameArray: any[] = [];
  industryResult: any[];
  pass: RegisterModel = new RegisterModel();
  tenantAdminPasswordRepeat = '';
  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
  setRandomPassword = true;
  active = false;
  saving = false;
  tenantDetailsInput: TenantDetailsInputDto = new TenantDetailsInputDto();
  CreateOrEditTenantComponent: any;
  filteredCountry;
  selectedCountry;
  selectedDepartment: string = null;
  selectedDesignation: string = null;
  selectedServices=[];
  selctedRepresentingAirlines;
  selectedRepresentingCountries;
  selectedCityData: any;
  selectedCountryData: any;
  selectedAirlineData: any;
  selectedDepartmentData: any;
  selectedIndustryData: any;
  selectedDesignationData: any;
  constructor(
    injector: Injector,
    public _validationServices: ValidationServiceService,
    private _commonServiceProxy: CommonServiceProxy,
    private _profileService: ProfileServiceProxy,
    public _validationService: InputValidationService,

  ) {
    super(injector);
    this.UserType = new AutoComplete();

  }
  ngOnInit(): void {
    this.selectedDepartment == null;
    this.selectedDesignation == null;
    this.selectedIndustry == null;
    if(!(this.TenantId > 0)){
    this.GetMastersData();
    }
    this._profileService.getPasswordComplexitySetting().subscribe(result => {
      this.passwordComplexitySetting = result.setting;
    });
  }

  GetMastersData(editData?: TenantDetailsInputDto) {
    let masterName = "AIRLINE,SERVICE,DEPARTMENT,DESIGNATION,INDUSTRY,CITY,COUNTRY,USERTYPE";
    this._commonServiceProxy.getMasterData_Cache(masterName).subscribe(result => {
      this.UserTypelist = this.fillMasterData(result, 'USERTYPE');
      this.airlineNameArray = this.fillMasterData(result, 'AIRLINE');
      this.servicesArray = this.fillMasterData(result, 'SERVICE');
      this.departmentNameArray = this.fillMasterData(result, 'DEPARTMENT');
      this.designationNameArray = this.fillMasterData(result, 'DESIGNATION');
      this.industryNameArray = this.fillMasterData(result, 'INDUSTRY');
      this.cityList = this.fillMasterData(result, 'CITY');
      this.countryCodeArray = this.fillMasterData(result, 'COUNTRY');
      this.representingCountriesArray = this.countryCodeArray;
      this.representingAirlinesArray = this.airlineNameArray;
      if(editData != null && editData != undefined){
        if (editData.services != null && editData.services != undefined) {
          this.selectedServices = editData.services.split(",").map(Number);
      }
      this.selectedCityData = editData.city > 0 ? this.cityList.filter(f => f.id == editData.city)[0] : 0;
      this.selectedCountryData =  editData.country > 0 ? this.countryCodeArray.filter(f => f.id == editData.country)[0] : 0;
      this.selectedDepartmentData = editData.departmentId > 0 ? this.departmentNameArray.filter(f => f.id == editData.departmentId)[0] : 0;
      this.selectedDesignationData = editData.designationId > 0 ? this.designationNameArray.filter(f => f.id == editData.designationId)[0] : 0;
      this.selectedAirlineData = editData.airlineId > 0 ? this.airlineNameArray.filter(f => f.id == editData.airlineId)[0] : 0;
      this.selectedIndustryData = editData.industryId > 0 ? this.industryNameArray.filter(f => f.id == editData.industryId)[0] : 0;
      if (editData.representingAirlines != null && editData.representingAirlines != undefined) {
        let airlines = editData.representingAirlines.split(",");
        if(airlines != null && airlines != undefined){
          this.selctedRepresentingAirlines = [];
          airlines.forEach(a=>{
            this.selctedRepresentingAirlines.push(this.representingAirlinesArray.filter(f => f.id == a)[0])
          });
        }
    }
    if (editData.representingCountries != null && editData.representingCountries != undefined) {
      let countries = editData.representingCountries.split(",");
      if(countries != null && countries != undefined){
        this.selectedRepresentingCountries = [];
        countries.forEach(a=>{
          this.selectedRepresentingCountries.push(this.representingCountriesArray.filter(f => f.id == a)[0])
        });
      }
  }

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
  SetDataForEdit(data?: TenantDetailsInputDto){
    this.tenantDetailsInput = data;
    this.GetMastersData(data);
  }
  onChange(event, userType) {
    if (event.target.checked) {
      this.isChecked = !this.isChecked;
      this.tenantDetailsInput.userTypeID = userType.id
      this.UserType.id = userType.id;
      this.UserType.name = userType.name;
    }
    else {
      this.UserType.name = null;
      this.UserType.id = null
      this.tenantDetailsInput.userTypeID = null;
    }
  }

  selectDepartment(dep) {
    if (typeof (dep) == 'object') {
      this.selectedDepartment = dep.name.toUpperCase();
    }
    else {
      this.selectedDepartment = null;
    }
  }
  selectDesignation(deg) {
    if (typeof (deg) == 'object') {
      this.selectedDesignation = deg.name.toUpperCase();
    }
    else {
      this.selectedDesignation = null;
    }
  }

  resetCountry() {
    this.selectedCountryData = null;
    this.tenantDetailsInput.isdCode = null;
    this.filteredCountry = [];
  }

  fillCountry(cityCode) {
    this.filteredCountry = [];
    this.filteredCountry = this.countryCodeArray.filter(x => x.id == cityCode.countryId)
    if (this.filteredCountry != null && this.filteredCountry != undefined && this.filteredCountry.length == 1) {
      this.selectedCountryData = this.filteredCountry[0];
      this.tenantDetailsInput.isdCode = this.filteredCountry[0].isd;
    }
    else {
      this.selectedCountryData = null;
      this.tenantDetailsInput.isdCode = null;
    }
  }

  getRepresentingAirlines(e) {
    this.representingAirlinesResult = this.representingAirlinesArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
  }

  getRepresentingCountries(e) {
    this.representingCountriesResult = this.representingCountriesArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase()))
      || (x.code).toLowerCase().includes((e.query.toLowerCase())));
  }

  onSelectService(ind) {
  }

  getAirline(e) {
    this.airlineResult = this.airlineNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
  }

  getIndustry(e) {
    this.industryResult = this.industryNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
    this.selectIndustry(e.query);
  }

  getCity(e) {
    this.cityCodeResult = this.cityList.filter(x => (x.code).toLowerCase().includes((e.query.toLowerCase())));
    this.fillCountry(e.query);
  }

  getService(e) {
    this.servicesResult = this.servicesArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
  }

  getCountry(e) {
    this.countryResult = this.countryArray.filter(x => (x.name).toLowerCase().startsWith((e.query.toLowerCase())));
  }

  getDepartment(e) {
    this.departmentResult = this.departmentNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
    this.selectDepartment(e.query);
  }

  getDesignation(e) {
    this.designationResult = this.designationNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
    this.selectDesignation(e.query)
  }

  checkDuplicateDesignation(value) {
    if (value != undefined || value != null) {
      for (let i = 0; i < this.designationNameArray.length; i++) {
        if (value.toLowerCase() == this.designationNameArray[i].name.toLowerCase()) {
          this.notify.warn(this.l("DuplicateDesignation"))
          return;
        }
      }
    }
  }

  checkDuplicateDepartment(value) {
    if (value != undefined || value != null) {
      for (let i = 0; i < this.departmentNameArray.length; i++) {
        if (value.toLowerCase() == this.departmentNameArray[i].name.toLowerCase()) {
          this.notify.warn(this.l("DuplicateDepartment"))
          return;
        }
      }
    }
  }

  selectIndustry(ind) {
    if (typeof (ind) == 'object') {
      this.selectedIndustry = ind.name.toUpperCase();
    }
    else {
      this.selectedIndustry = null
    }
  }

  checkDuplicateIndustry(value) {
    if (value != undefined || value != null) {
      for (let i = 0; i < this.industryNameArray.length; i++) {
        if (value.toLowerCase() == this.industryNameArray[i].name.toLowerCase()) {
          this.notify.warn(this.l("DuplicateIndustry"))
          return;
        }
      }
    }
  }
CheckValidData():boolean{
  if (this.tenantDetailsInput.userTypeID == null && this.tenantDetailsInput.userTypeID == undefined) {
    this.message.warn(this.l('PleaseSelectuserType'));
    return false;
  } 
  if(!this.tenantDetailsForm.form.valid){
          const controls = this.tenantDetailsForm.controls;
          Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    return false;
  }
  return true;
}
GetDataToInsert(): TenantDetailsInputDto {
    this.tenantDetailsInput.city = this.selectedCityData?.id;   
    this.tenantDetailsInput.country = this.selectedCountryData?.id;
    this.tenantDetailsInput.setRandomPassword = this.setRandomPassword;
    if (this.selectedServices != null && this.selectedServices != undefined) {
        this.tenantDetailsInput.services = this.selectedServices.join()
    }
    if ((this.UserType.name=='GSA' || this.UserType.name=='GHA') && this.selctedRepresentingAirlines != null && this.selctedRepresentingAirlines != undefined) {
      this.tenantDetailsInput.representingAirlines = this.selctedRepresentingAirlines?.map(s => s.id).toString();
    }
    if (this.selectedAirlineData != null && this.selectedAirlineData != undefined) {
      this.tenantDetailsInput.airlineId = this.selectedAirlineData?.id;
    }
    if (this.selectedDepartmentData != null && this.selectedDepartmentData != undefined) {
      this.tenantDetailsInput.departmentId = this.selectedDepartmentData?.id;
    }
    if (this.selectedIndustryData != null && this.selectedIndustryData != undefined) {
      this.tenantDetailsInput.industryId = this.selectedIndustryData?.id;
    }
    if ((this.UserType.name=='GSA' || this.UserType.name=='GHA') && this.selectedRepresentingCountries != null && this.selectedRepresentingCountries != undefined) {
      this.tenantDetailsInput.representingCountries = this.selectedRepresentingCountries.map(s => s.id).toString();
    }
    if (this.selectedDesignationData != null && this.selectedDesignationData != undefined) {
      this.tenantDetailsInput.designationId = this.selectedDesignationData?.id;
    }  
    return this.tenantDetailsInput;
  }
}


export class AutoComplete {
  id: number;
  name: string;
}
