import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { InvoiceNewDto, InvoiceServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.less'],
    animations: [appModuleAnimation()]
})

export class InvoiceComponent extends AppComponentBase implements OnInit {

    paymentId = 0;
    invoiceInfo: InvoiceNewDto = new InvoiceNewDto();
    companyLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-light.svg';

    constructor(
        injector: Injector,
        private _invoiceServiceProxy: InvoiceServiceProxy,
        private activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getAllInfo();
    }

    getAllInfo(): void {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.paymentId = params['paymentId'];
        });

        this._invoiceServiceProxy.getInvoiceInfoNew(this.paymentId).subscribe(result => {
            this.invoiceInfo = result;
        });
    }
}
