import { InputValidationService } from '@account/shared/input-validation.service';
import { Component, Injector, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonServiceProxy, MasterDataDto, UserRegistrationInput, UserRegistrationServiceProxy } from '@shared/service-proxies/service-proxies';
import { eq } from 'lodash-es';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-user-detailed-registration',
  templateUrl: './user-detailed-registration.component.html',
  styleUrls: ['./user-detailed-registration.component.css'],
  animations: [appModuleAnimation()]
})
export class UserDetailedRegistrationComponent extends AppComponentBase implements OnInit {

  saving: boolean = false;
  UserType: AutoComplete;                      //User Type which will come from User Sign-Up Page
  UserRegistration: UserRegistrationInput;     // DTO variable which will be used for data binding
  tenantId;


  //Some Local Arrays that are used for Auto-Complete
  //START
  airlineNameArray: any[] = [];
  airlineResult: any[];

  servicesArray: any[] = [];
  servicesResult: any[];


  departmentNameArray: any[] = [];
  departmentResult: any[];

  designationNameArray: any[] = [];
  designationResult: any[]

  industryNameArray: any[] = [];
  industryResult: any[];

  cityCode: any[] = [];
  cityCodeResult: any;

  countryCodeArray: any[] = []
  countryCodeResult: any[];

  representingAirlinesArray: any[] = [];
  representingAirlinesResult: any[];

  representingCountriesArray: any[] = [];
  //END

  representingCountriesResult: any[];
  selectedDepartment: string = null;
  selectedDesignation: string = null;
  selectedIndustry: string = null;


  constructor(injector: Injector, private _userDetailRegistration: UserRegistrationServiceProxy,
    private _router: Router, private _activatedRoute: ActivatedRoute,
    private _commonServiceProxy: CommonServiceProxy,
    public _validationService:InputValidationService) {
    super(injector)
    this.UserRegistration = new UserRegistrationInput();
    this.UserType = new AutoComplete();
  }

  ngOnInit(): void {
    this.UserType = { id: 0, name: this.l("User") }
    this.selectedDepartment == null;
    this.selectedDesignation == null;
    this.selectedIndustry == null;
    this.getMasterData();
    let Qval = this._activatedRoute.snapshot.queryParams['c'];
    if (Qval != "" && Qval != undefined) {
      this.decriptQval(Qval);
    }
    
  }
  decriptQval(str) {
    this._commonServiceProxy.simpleStringDecription(str).subscribe(result => {
      let data_Id = result.filter(obj => obj.key == "userTypeId")
      let data_Name = result.filter(obj => obj.key == "userType")
      if (data_Id != undefined && data_Id.length > 0 && data_Name != undefined && data_Name.length > 0) {
        this.UserType = 
        {
           id: parseInt(data_Id[0].value),
           name: data_Name[0].value.toUpperCase()=="OTHERS" ? this.l("User") :data_Name[0].value 
        }
      }
      this.UserRegistration.userId = parseInt(result.filter(obj => obj.key == "userId")[0].value)
    });
  }
  getMasterData() {
    let masterName = "AIRLINE,SERVICE,DEPARTMENT,DESIGNATION,INDUSTRY,CITY,COUNTRY";
    this._commonServiceProxy.getMasterData_Cache(masterName).subscribe(result => {
      this.airlineNameArray = this.fillMasterData(result, 'AIRLINE');
      this.servicesArray = this.fillMasterData(result, 'SERVICE');
      this.departmentNameArray = this.fillMasterData(result, 'DEPARTMENT');
      this.designationNameArray = this.fillMasterData(result, 'DESIGNATION');
      this.industryNameArray = this.fillMasterData(result, 'INDUSTRY');
      this.cityCode = this.fillMasterData(result, 'CITY');
      this.countryCodeArray = this.fillMasterData(result, 'COUNTRY');
      this.representingCountriesArray = this.countryCodeArray;
      this.representingAirlinesArray = this.airlineNameArray;
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
  //save method which will be called by ngSubmit
  save(form: NgForm, values) {
    let UserRegistrationInputData = new UserRegistrationInput();
    // For Duplicacy Validation after click on Save
    //START
    if (values.departmentName != undefined || values.departmentName != null) {
      for (let i = 0; i < this.departmentNameArray.length; i++) {
        if (values.departmentName.toLowerCase() == this.departmentNameArray[i].name.toLowerCase()) {
          this.notify.warn(this.l("DuplicateDepartment"))
          return;
        }
      }
    }


    if (values.designationName != undefined || values.designationName != null) {
      for (let i = 0; i < this.designationNameArray.length; i++) {
        if (values.designationName.toLowerCase() == this.designationNameArray[i].name.toLowerCase()) {
          this.notify.warn(this.l("DuplicateDesignation"))
          return;
        }
      }
    }

    if (values.industryName != undefined || values.industryName != null) {
      for (let i = 0; i < this.industryNameArray.length; i++) {
        if (values.industryName.toLowerCase() == this.industryNameArray[i].name.toLowerCase()) {
          this.notify.warn(this.l("DuplicateIndustry"))
          return;
        }
      }
    }

    //END


    //Setting values into Dto variable from Form-Values
    //START
    UserRegistrationInputData.userTypeId = this.UserType.id;
    if (values.airlineName != undefined || values.airlineName != null) {
      UserRegistrationInputData.airlineId = values.airlineName.id;
      UserRegistrationInputData.company = values.airlineName.name;
    }
    else{
      UserRegistrationInputData.company = this.UserRegistration.company;
    }

    if (values.industry != undefined || values.industry != null) {
      UserRegistrationInputData.industryId = values.industry.id;
      UserRegistrationInputData.industry = values.industry.name.toUpperCase() == "OTHERS" ? this.UserRegistration.industry :values.industry.name;  
    }

    if (values.department != undefined || values.department != null) {
      UserRegistrationInputData.departmentId = values.department.id;
     UserRegistrationInputData.department=values.department.name.toUpperCase() == "OTHERS" ? this.UserRegistration.department :values.department.name;  
    }
    

    if (values.designation != undefined || values.designation != null) {
      UserRegistrationInputData.designationId = values.designation.id;
      UserRegistrationInputData.designation=values.designation.name.toUpperCase() == "OTHERS" ? this.UserRegistration.designation :values.designation.name;  
    }



    
    // UserRegistrationInputData.designationId = values.designation.id;

    //Setting Comma Seperated Values in Multiple AutoComplete
    //START
    if (values.representingAirlines != undefined || values.representingAirlines != null) {
      UserRegistrationInputData.representingAirlines = values.representingAirlines.map(s => s.id).toString();;
    }

    if (values.presenceOrRepresentingCountries != undefined || values.presenceOrRepresentingCountries != null) {
      UserRegistrationInputData.representingCountries = values.presenceOrRepresentingCountries.map(s => s.id).toString();;
    }

    UserRegistrationInputData.services = (values.services != null && values.services != undefined) ? values.services.map(s => s.id).toString():null;
    //END

    UserRegistrationInputData.city = values.city.id;
    UserRegistrationInputData.country = values.country.id;
    //END
    UserRegistrationInputData.userId = this.UserRegistration.userId;
    // UserRegistrationInputData.department = this.UserRegistration.department;
    // UserRegistrationInputData.designation = this.UserRegistration.designation;
    UserRegistrationInputData.contact = this.UserRegistration.contact;
    UserRegistrationInputData.industry = this.UserRegistration.industry;
    UserRegistrationInputData.isdCode = this.UserRegistration.isdCode;
    this.saving = true;
    this._userDetailRegistration.createDetailedUserRegistration(UserRegistrationInputData).pipe(finalize(() => { this.saving = false; })).subscribe(result => {
      
      if(result>0){
        this.message.success(this.l('UserRegisteredSuccessfullyMsg')).then(() => {
      // this.notify.success(this.l("SavedSuccessfully"))
      form.resetForm();
      if(this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0){
        this.setAppModuleBodyClassInternal();
        this._router.navigate(['app/registered-user'], { 
          queryParams:
           { 
            isEmailConfirmed: true,
            isRegisteredUser: true
           } 
          });    
      }
      else{
      this._router.navigate(['account/login']);
      }
    });
  }

  else{
    this.saving=false
  }
    })
  }






  //END


  //Methods that Check Duplicate values on Input
  //START

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
  //END

  //Methods for AutoComplete

  //START

  selectDepartment(dep) {
    if(typeof(dep) == 'object')
    {
      this.selectedDepartment = dep.name.toUpperCase();
    }
    else{
      this.selectedDepartment = null;
    }  
  }

  selectDesignation(deg) {
    if(typeof(deg) == 'object'){
      this.selectedDesignation = deg.name.toUpperCase(); 
    }
    else{
      this.selectedDesignation = null;
    }
     }

  selectIndustry(ind) {
    if(typeof(ind) == 'object'){
    this.selectedIndustry = ind.name.toUpperCase();
    }
      else{
      this.selectedIndustry = null
    }
  }

  getAirline(e) {
    this.airlineResult = this.airlineNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
  }

  getDesignation(e) {
    this.designationResult = this.designationNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));

  this.selectDesignation(e.query)
  }

  getService(e) {
    this.servicesResult = this.servicesArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));

  }

  getDepartment(e) {
    this.departmentResult = this.departmentNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
   this.selectDepartment(e.query);
  }

  getIndustry(e) {
    this.industryResult = this.industryNameArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())));
    this.selectIndustry(e.query);
  }

  getCity(e) {
    // this.cityCodeResult = this.cityCode.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase()))
    //                                                 || (x.code).toLowerCase().includes((e.query.toLowerCase())));
    this.cityCodeResult = this.cityCode.filter(x => (x.code).toLowerCase().includes((e.query.toLowerCase())));
    this.fillCountry(e.query);
  }
  resetCountry(){
    this.UserRegistration.country = null;
    this.UserRegistration.isdCode = null;
    this.filteredCountry = [];
    this.selectedCountry = [];
  }
  filteredCountry;
  selectedCountry;
  fillCountry(cityCode) {
    this.filteredCountry = [];
    this.selectedCountry = [];

    //this.selectedCountry = this.countryCodeArray.filter

    this.filteredCountry = this.countryCodeArray.filter(x => x.id == cityCode.countryId)
    if (this.filteredCountry != null && this.filteredCountry != undefined && this.filteredCountry.length == 1) {

      this.UserRegistration.country = this.filteredCountry[0];
      this.UserRegistration.isdCode = this.filteredCountry[0].isd;
    }

    else {
      this.UserRegistration.country = null;
      this.UserRegistration.isdCode = null;
    }
  }

  getCountry(e) {
    this.countryCodeResult = this.filteredCountry.filter(x => (x.name).toLowerCase().includes(e.query.toLowerCase())
                                                          || (x.code).toLowerCase().includes((e.query.toLowerCase())));
  }

  getRepresentingAirlines(e) {
    this.representingAirlinesResult = this.representingAirlinesArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase())))
  }

  getRepresentingCountries(e) {
    this.representingCountriesResult = this.representingCountriesArray.filter(x => (x.name).toLowerCase().includes((e.query.toLowerCase()))
                                                                              || (x.code).toLowerCase().includes((e.query.toLowerCase())));
  }
  backClick(){
    if(this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0){
    this._router.navigate(['app/registered-user'], { 
      queryParams:
       { 
        isEmailConfirmed: true,
        isRegisteredUser: false
       } 
      });  
    }
    else{
      this._router.navigate(['account/login']);
    }
  }
  onSelectService(){
    // document.getElementById("services").blur();
    // setTimeout(() => {
    //   debugger
    //   document.getElementById("services").focus();
    // },3500)
  }
  setAppModuleBodyClassInternal(): void {
    let currentBodyClass = document.body.className;
    let classesToRemember = '';

    if (currentBodyClass.indexOf('brand-minimize') >= 0) {
        classesToRemember += ' brand-minimize ';
    }

    if (currentBodyClass.indexOf('aside-left-minimize') >= 0) {
        classesToRemember += ' aside-left-minimize';
    }

    if (currentBodyClass.indexOf('brand-hide') >= 0) {
        classesToRemember += ' brand-hide';
    }

    if (currentBodyClass.indexOf('aside-left-hide') >= 0) {
        classesToRemember += ' aside-left-hide';
    }

    if (currentBodyClass.indexOf('swal2-toast-shown') >= 0) {
        classesToRemember += ' swal2-toast-shown';
    }

    document.body.className = this.ui.getAppModuleBodyClass() + ' ' + classesToRemember;
}
  //END 
}


//Class that is used for UserType variable
export class AutoComplete {
  id: number;
  name: string;
}
