import { NgForm } from '@angular/forms';
import { UserRegistrationServiceProxy, UserSignUpInput } from './../../../shared/service-proxies/service-proxies';
import { RegisterModel } from '@account/register/register.model';
import { Component, Injector, OnInit, Output } from '@angular/core';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PasswordComplexitySetting } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  constructor(injector: Injector, private _userRegistrationService: UserRegistrationServiceProxy,
     private _router: Router) {
    super(injector);
  }
  usertypes = [
    { id: 1, name: "AIRLINE" },
    { id: 2, name: "GSA" },
    { id: 3, name: "GHA" },
    { id: 4, name: "FORWARDER" },
    { id: 5, name: "SHIPPER" },
    { id: 6, name: "OTHERS" }
  ];
  ngOnInit(): void {

  }

  onChange(event, data) {
    if (event.target.checked) {
      this.isChecked = !this.isChecked;
      console.log(this.isCheckedName)
      this.model.userTypeId = data.id
    }
    else {
      this.model.userTypeId = null;

    }
  }

  save(form: NgForm): void {
    if (this.model.userTypeId != null) {
      this._userRegistrationService.createUserSignUp(this.model).subscribe(e => {
        // this.notify.info(this.l('SavedSuccessfully'));
        //console.log("saved");
        form.resetForm();
        this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
          this._router.navigate(['account/login']);
        });

      });
    } else {
      this.message.warn(this.l('PleaseSelectuserType'))
    }

  }

}


