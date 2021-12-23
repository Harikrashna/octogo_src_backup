import { NgForm } from '@angular/forms';
import { MasterDataDto, UserRegistrationServiceProxy, UserSignUpInput } from './../../../shared/service-proxies/service-proxies';
import { RegisterModel } from '@account/register/register.model';
import { Component, Injector, OnInit, Output } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PasswordComplexitySetting, CommonServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css'],
  animations: [accountModuleAnimation()]
})
export class UserSignUpComponent extends AppComponentBase implements OnInit {
  model: UserSignUpInput = new UserSignUpInput();
  pass: RegisterModel = new RegisterModel()
  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
  isChecked;
  isCheckedName;
  saving = false;
  constructor(injector: Injector, private _userRegistrationService: UserRegistrationServiceProxy
    ,private _commonServiceProxy: CommonServiceProxy,
     private _router: Router) {
    super(injector);
  }
  usertypes:any = [];
  // usertypes = [
  //   { id: 1, name: "AIRLINE" },
  //   { id: 2, name: "GSA" },
  //   { id: 3, name: "GHA" },
  //   { id: 4, name: "FORWARDER" },
  //   { id: 5, name: "SHIPPER" },
  //   { id: 6, name: "OTHERS" }
  // ];

  ngOnInit(): void {
this.getUserType("USERTYPE");
  }
  getUserType(masterName) {
    this._commonServiceProxy.getMasterData_Cache(masterName).subscribe(result => {
      this.usertypes = this.fillMasterData(result ,masterName);
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
  onChange(event, data) {
    if (event.target.checked) {
      this.isChecked = !this.isChecked;
      console.log(data.id)
      this.model.userTypeId = data.id
    }
    else {
      this.model.userTypeId = null;

    }
  }

  save(form: NgForm): void {
    if (this.model.userTypeId != null) {
      this.saving = true;
      this._userRegistrationService.createUserSignUp(this.model).pipe(finalize(() => { this.saving = false; })).subscribe(e => {
        form.resetForm();

        this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
          this._router.navigate(['account/login']);
        });

      });
    } else {
      this.message.warn(this.l('PleaseSelectuserType'))
    }

  }
  spaceBars(e:any){
    if(e.keyCode == 32){
    return false;
    }
}
spaceBar(e:any){
  if(e.target.selectionStart ==0 && e.keyCode == 32){
  return false;
  }
}

}


