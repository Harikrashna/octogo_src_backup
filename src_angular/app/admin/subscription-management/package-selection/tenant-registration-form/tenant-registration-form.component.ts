import { RegisterTenantModel } from '@account/register/register-tenant.model';
// import { TenantRegistrationHelperService } from '@account/register/tenant-registration-helper.service';
import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PasswordComplexitySetting, ProfileServiceProxy, RegisterTenantOutput, TenantRegistrationServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tenant-registration-form',
  templateUrl: './tenant-registration-form.component.html',
  styleUrls: ['./tenant-registration-form.component.css']
})
export class TenantRegistrationFormComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Output() TenantCreated = new EventEmitter();
  @Input() EditionData;
  @Input() AddonsData;
  @Input() ProductName;

  model: RegisterTenantModel = new RegisterTenantModel();
  passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
  // subscriptionStartType = SubscriptionStartType;
  // editionPaymentType: EditionPaymentType;
  // paymentPeriodType = PaymentPeriodType;
  // selectedPaymentPeriodType: PaymentPeriodType = PaymentPeriodType.Monthly;
  // subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
  paymentId = '';
  // recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;

  saving = false;

  constructor(
      injector: Injector,
      private _router: Router,
      private _tenantRegistrationService: TenantRegistrationServiceProxy,
      private _profileService: ProfileServiceProxy,
      public _validationService: ValidationServiceService
  ) {
      super(injector);
  }

  ngOnInit() {
debugger
console.log(this.AddonsData)
      //Prevent to create tenant in a tenant context
      if (this.appSession.tenant != null) {
          this._router.navigate(['account/login']);
          return;
      }

      this._profileService.getPasswordComplexitySetting().subscribe(result => {
          this.passwordComplexitySetting = result.setting;
      });
  }

  ngAfterViewInit() {
      // if (this.model.editionId) {
      //     this._tenantRegistrationService.getEdition(this.model.editionId)
      //         .subscribe((result: EditionSelectDto) => {
      //             this.model.edition = result;
      //         });
      // }
  }

  // get useCaptcha(): boolean {
  //     return this.setting.getBoolean('App.TenantManagement.UseCaptchaOnRegistration');
  // }

  save(): void {

      let recaptchaCallback = (token: string) => {
          this.saving = true;
          this.model.editionId = this.EditionData.editionID;
          this.model.captchaResponse = token;
          this._tenantRegistrationService.registerTenant(this.model)
              .pipe(finalize(() => { this.saving = false; }))
              .subscribe((result: RegisterTenantOutput) => {
                  this.notify.success(this.l('SuccessfullyRegistered'));
                  if (this.appSession.user != null && this.appSession.user != undefined && this.appSession.user.id > 0) {
                      if (result.tenantId > 0) {
                        this.TenantCreated.emit(result.tenantId);
                          abp.multiTenancy.setTenantIdCookie(result.tenantId);

                         
                      }
                  }
              });
      };

      // if (this.useCaptcha) {
      //     this._reCaptchaV3Service.execute(this.recaptchaSiteKey, 'register_tenant', (token) => {
      //         recaptchaCallback(token);
      //     });
      // } else {
          recaptchaCallback(null);
      // }
  }
}
