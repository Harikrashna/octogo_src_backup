import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { UserRegistrationServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
  selector: 'app-unregistered-user-dashboard',
  templateUrl: './unregistered-user-dashboard.component.html',
  styleUrls: ['./unregistered-user-dashboard.component.css']
})
export class UnregisteredUserDashboardComponent extends AppComponentBase implements OnInit {
  isEmailConfirmed: boolean = false;
  isRegisteredUser: boolean = false;
  saving = false;
  constructor(injector: Injector,private _router: Router 
    ,private _userDetailRegistration: UserRegistrationServiceProxy
    ,private _authService: AppAuthService,
    private _activatedRoute: ActivatedRoute) {
    super(injector);
  }
  ngOnInit(): void {
    this.isEmailConfirmed = this.appSession.user.isEmailConfirmed;
    this.isRegisteredUser = this.appSession.user.userDetailId > 0 ? true : false;
    if(this._activatedRoute.snapshot.queryParams['isEmailConfirmed']=="true"){
      this.isEmailConfirmed = true;
    }
    if(this._activatedRoute.snapshot.queryParams['isRegisteredUser']=="true"){
      this.isRegisteredUser = true;
    }
  }

  async getRegistrationpage() {
    this._router.navigate(['account/user-detailed-registration']);
  }
  resendCode(): void {
    this.saving = true;
    this.showMainSpinner();
    this._userDetailRegistration.sendEmailVerificationLink(this.appSession.user.id)
        .subscribe(() => {
          this.hideMainSpinner();
          this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
            this._authService.logout();
          });
        });
}

}
