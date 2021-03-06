import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, ActivateEmailInput, CommonServiceProxy, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';

@Component({
    template: `<div class="login-form"><div class="alert alert-success text-center" role="alert"><div class="alert-text">{{waitMessage}}</div></div></div>`
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {

    waitMessage: string;

    model: ActivateEmailInput = new ActivateEmailInput();

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _commonServiceProxy: CommonServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');

        this.model.c = this._activatedRoute.snapshot.queryParams['c'];
        this._accountService.resolveTenantId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
            let reloadNeeded = this.appSession.changeTenantIfNeeded(
                tenantId
            );

            if (reloadNeeded) {
                return;
            }

            this._accountService.activateEmail(this.model)
                .subscribe(() => {
                    this.notify.success(this.l('YourEmailIsConfirmedMessage'), '',
                        {
                            onClose: () => {
                                this._router.navigate(['account/login']);
                            }
                        });
                    // Added by Hari Krashna - only for Signed Up users
                    if (this.model.c != null && this.model.c != undefined) {
                        this._commonServiceProxy.simpleStringDecription(this.model.c).subscribe(result => {
                            let data_Id = result.filter(obj => obj.key == "userTypeId");
                            if (data_Id != undefined && data_Id.length > 0) {                               // if user confirm mail after Sign Up
                                this._router.navigate(['account/user-detailed-registration'], { queryParams: { c: this.model.c }, queryParamsHandling: 'merge' });
                            }
                            else {
                                abp.auth.clearToken();
                                abp.auth.clearRefreshToken();
                                this._router.navigate(['account/login']);
                            }
                        });
                    }
                    else {
                        this._router.navigate(['account/login']);
                    }

                });
        });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr, 10);
        if (Number.isNaN(tenantId)) {
            tenantId = undefined;
        }

        return tenantId;
    }
}
