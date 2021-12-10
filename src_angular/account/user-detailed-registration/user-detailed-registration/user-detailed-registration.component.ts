import { Component, Injector, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonServiceProxy, UserRegistrationInput, UserRegistrationServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-user-detailed-registration',
  templateUrl: './user-detailed-registration.component.html',
  styleUrls: ['./user-detailed-registration.component.css'],
  animations:[appModuleAnimation()]
})
export class UserDetailedRegistrationComponent extends AppComponentBase implements OnInit {

  active:boolean=true;
  saving:boolean=false;
  UserType:AutoComplete;
  UserRegistration:UserRegistrationInput;
  tenantId;
 
  airlineNameArray:any[]=[
    {
     "id":1,"name":"Emirates"
    },
    {
      "id":2,"name":"AIR INDIA"
     },
     {
      "id":3,"name":"Indigo"
     },
     {
      "id":4,"name":"SL Airlines"
     },
     {
      "id":5,"name":"AIR ASIA"
     }
  ];
  airlineResult:any[];

  servicesArray:any[]=[
    {
    "id":1,"name":"Quick Booking Solutions"
   },
   {
     "id":2,"name":"Payment Solutions"
    },
    {
     "id":3,"name":"Airlines Solutions"
    },
    {
     "id":4,"name":"Handling Solutions"
    },
    {
     "id":5,"name":"First & Last Mile Solution"
    },
    {
      "id":6,"name":"Connecting Cargo Ecosystem"
     },
     {
       "id":7,"name":"Compiliance"
      },
      {
       "id":8,"name":"OutSourcing"
      }
    ];
  servicesResult:any[];

  
  departmentNameArray:any[]=[{
    "id":1,"name":"Sales"
   },
   {
     "id":2,"name":"Operation"
    },
    {
     "id":3,"name":"Admin"
    },
    {
     "id":4,"name":"IT"
    },
    {
      "id":5,"name":"Others"
     }
  ];
  departmentResult:any[];

  designationNameArray:any[]=[{
    "id":1,"name":"Asst. Manager"
   },
   {
     "id":2,"name":"Team Leader"
    },
    {
     "id":3,"name":"Software Developer"
    },
    {
     "id":4,"name":"Manager"
    },
    {
      "id":5,"name":"Employee"
     },
     {
      "id":6,"name":"Others"
     }
    ];
  designationResult:any[]

  industryNameArray:any[]=[{
    "id":1,"name":"Textiles"
   },
   {
     "id":2,"name":"Cargo"
    },
    {
     "id":3,"name":"Cosmetics"
    },
    {
     "id":4,"name":"Electronics"
    },
    {
      "id":5,"name":"IT"
     },
    {
      "id":6,"name":"Others"
     }
  
  ];
  industryResult:any[];

  cityCode:any[]=[{"id":1,"name":"GGN","countryId":1},
  {"id":2,"name":"LON","countryId":4},
  {"id":3,"name":"NYC","countryId":2},
  {"id":4,"name":"TOK","countryId":3},
  {"id":5,"name":"DEL","countryId":1},
  {"id":6,"name":"Gor","countryId":1},
  {"id":5,"name":"GEO","countryId":2}

  ];
  cityCodeResult:any;

  countryCodeArray:any[]=[{"id":1,"name":"IND","isd":"+91"},
  {"id":2,"name":"USA","isd":"+1"},
  {"id":3,"name":"JAP","isd":"+81"},
  {"id":4,"name":"UK","isd":"+44"},
  ]
  countryCodeResult:any[];

  representingAirlinesArray:any[]=[{"id":1,"name":'China Airlines'},
  {"id":2,"name":'Korean Airlines'},
  {"id":3,"name":'Indian Airlines'},
  {"id":4,"name":'South African Airlines'},
  {"id":5,"name":'AIR INDIA'},
  ];
  representingAirlinesResult:any[];

  representingCountriesArray:any[]=[{
    "id":1,"name":"China"
   },
   {
     "id":2,"name":"Korea"
    },
    {
     "id":3,"name":"India"
    },
    {
     "id":4,"name":"South Africa"
    }
    ];
  representingCountriesResult:any[];
  selectedDepartment:string=null;
  selectedDesignation:string=null;
  selectedIndustry:string=null;
  

  constructor(injector:Injector,private _userDetailRegistration:UserRegistrationServiceProxy,
    private _router:Router,private _activatedRoute: ActivatedRoute,
    private _commonServiceProxy: CommonServiceProxy) { 
    super(injector)
    this.UserRegistration = new UserRegistrationInput();
    this.UserType = new AutoComplete();
  }

  ngOnInit(): void {
    this.selectedDepartment == null;
    this.selectedDesignation == null;
    this.selectedIndustry == null;
    let Qval = this._activatedRoute.snapshot.queryParams['c'];
      if (Qval != "" && Qval != undefined) {
        this.decriptQval(Qval);
        }
  }
  decriptQval(str){
    this._commonServiceProxy.simpleStringDecription(str).subscribe(result => {
      let data_Id = result.filter(obj => obj.key == "userTypeId")
      let data_Name = result.filter(obj => obj.key == "userType")
      if(data_Id != undefined && data_Id.length > 0 && data_Name != undefined && data_Name.length > 0){
      this.UserType = { id:parseInt(data_Id[0].value),name: data_Name[0].value }
      }
      else{
        this.UserType = { id:0,name: "User" }
      }
      this.UserRegistration.userId = parseInt(result.filter(obj => obj.key == "userId")[0].value) 
    });
  }
  save(form:NgForm,values){

    if(values.departmentName != undefined || values.departmentName != null)
    {
      for(let i = 0 ; i < this.departmentNameArray.length ; i++){
        if(values.departmentName.toLowerCase() == this.departmentNameArray[i].name.toLowerCase()){
          this.notify.warn(this.l("DuplicateDepartment"))
          return;
        }
      }
    }
    

    if(values.designationName != undefined || values.designationName != null)
    {
      for(let i=0;i<this.designationNameArray.length;i++){
        if(values.designationName.toLowerCase() == this.designationNameArray[i].name.toLowerCase()){
        this.notify.warn(this.l("DuplicateDesignation"))
        return;
       }
      }
    }

    if(values.industryName != undefined || values.industryName != null)
    {
      for(let i=0;i<this.industryNameArray.length;i++){
        if(values.industryName.toLowerCase() == this.industryNameArray[i].name.toLowerCase()){
          this.notify.warn(this.l("DuplicateIndustry"))
          return;
        }
      }
    }
    


    this.UserRegistration.userTypeId=this.UserType.id;
    if(values.airlineName != undefined || values.airlineName != null )
    {
      this.UserRegistration.airlineId = values.airlineName.id;
    }

    if(values.industry != undefined || values.industry != null )
    {
      this.UserRegistration.industryId = values.industry.id;
    }
    
    
    this.UserRegistration.departmentId = values.department.id;
    this.UserRegistration.designationId = values.designation.id;
    
    if(values.representingAirlines != undefined || values.representingAirlines != null )
    {
      this.UserRegistration.representingAirlines=values.representingAirlines.map(s=>s.id).toString();;
    }

    if(values.presenceOrRepresentingCountries != undefined || values.presenceOrRepresentingCountries != null )
    {
      this.UserRegistration.representingCountries=values.presenceOrRepresentingCountries.map(s=>s.id).toString();; 
    }
    this.UserRegistration.city = values.city.id;
    this.UserRegistration.country = values.country.id;

    this.UserRegistration.services = values.services.map(s=>s.id).toString();
    this._userDetailRegistration.createDetailedUserRegistration(this.UserRegistration).subscribe(result=>{
      debugger
      this.tenantId=result;
      console.log(this.tenantId)
        this.notify.success(this.l("SavedSuccessfully"))
        form.resetForm();
        this._router.navigate(['account/login']);  
    })
   }


   selectDepartment(dep){
  
    this.selectedDepartment = dep.name;
  
   }

   selectDesignation(deg){

      this.selectedDesignation = deg.name;
   }
  

  selectIndustry(ind){
    this.selectedIndustry = ind.name;
   
  }

  IsNumeric(e) {
    if (e.target.value == "" && e.keyCode == 48) {
      return false
    }
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 48 && keyCode <= 57));
    return ret

  }

  IsAlphabet(e){
    
    if (e.target.value == "" && e.keyCode == 32) {
      return false
    }
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 65 && keyCode <= 120) || (keyCode==32));
    return ret

  }

  IsAlphabetWithoutWhiteSpace(e){
    if (e.target.value == "" && e.keyCode == 32) {
      return false
    }
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 65 && keyCode <= 120));
    return ret
  }

  IsAlphanumeric(e){
    if (e.target.value == "" && e.keyCode == 32) {
      return false
    }
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 65 && keyCode <= 120) || (keyCode==32) || (keyCode >= 48 && keyCode <= 57));
    return ret

  }

  getAirline(e){
    this.airlineResult = this.airlineNameArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
  }

  getDesignation(e){
  this.designationResult = this.designationNameArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
  this.selectDesignation(e.query)
  }

  getService(e){
    this.servicesResult = this.servicesArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    
  }

  getDepartment(e){
    this.departmentResult = this.departmentNameArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    this.selectDepartment(e.query);
  }

  getIndustry(e){
    this.industryResult = this.industryNameArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
    this.selectIndustry(e.query);
  }

  getCity(e)
  {
   this.cityCodeResult = this.cityCode.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
   this.fillCountry(e.query);
  }

  fillCountry(cityCode){
    let tempCountry = this.countryCodeArray.filter(x=> x.id == cityCode.countryId)
    if(tempCountry != null && tempCountry != undefined && tempCountry.length>0){

  this.UserRegistration.country = tempCountry[0];
   this.UserRegistration.isdCode = tempCountry[0].isd; 
    }

    else{
      this.UserRegistration.country = null;
      this.UserRegistration.isdCode = null; 
    }     
  }

  getCountry(e){
    this.countryCodeResult = this.countryCodeArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())));
  }

  getRepresentingAirlines(e){
    this.representingAirlinesResult = this.representingAirlinesArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())))
  }

  getRepresentingCountries(e){
    this.representingCountriesResult = this.representingCountriesArray.filter(x=>(x.name).toLowerCase().startsWith((e.query.toLowerCase())))
  }

}



export class AutoComplete
{
  id:number;
  name:string;
}
