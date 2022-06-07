import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { InvoiceDataInputDto, PaymentServiceProxy, TenantInvoiceSettingsEditDto, TenantServiceProxy, TenantSettingsEditDto, TenantSettingsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-invoice-detail',
    templateUrl: './invoice-details.component.html'
   
})

export class InvoiceDetailsComponent extends AppComponentBase {
    InvoiceDetails: InvoiceDataInputDto = new InvoiceDataInputDto(); //Added by:Merajuddin
    settings: TenantSettingsEditDto = new TenantSettingsEditDto();
    @Output() newItemEvent = new EventEmitter<string>();
    constructor(
        private _paymentAppService: PaymentServiceProxy,
        injector: Injector) {
        super(injector)
    }

    save() {
        let input = new TenantInvoiceSettingsEditDto()
        if (this.appSession.tenant != null && this.appSession.tenant != undefined) {
            input.tenantId = this.appSession.tenant.id;
        } else {
            input.tenantId = abp.multiTenancy.getTenantIdCookie();
        }
        input.address = this.InvoiceDetails.address
        input.legalName = this.InvoiceDetails.legalName
        input.taxVatNo = this.InvoiceDetails.taxVatNo
        this._paymentAppService.updateInvoiceSettings(input).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.newItemEvent.emit();
        })
    }

}

