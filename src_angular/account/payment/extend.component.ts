import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    EditionSelectDto,
    PaymentInfoDto,
    PaymentServiceProxy,
    CreatePaymentNewDto,
    PaymentGatewayModel,
    EditionPaymentType,
    PaymentPeriodType,
    SubscriptionPaymentGatewayType,
    TenantRegistrationServiceProxy,
    EditionDetailsForEditDto,
    ModulePricingDto
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { PaymentHelperService } from './payment-helper.service';

@Component({
    templateUrl: './extend.component.html',
    animations: [accountModuleAnimation()]
})

export class ExtendEditionComponent extends AppComponentBase implements OnInit {

    editionPaymentType: EditionPaymentType;
    edition: EditionSelectDto = new EditionSelectDto();
    tenantId: number = abp.session.tenantId;
    paymentPeriodType = PaymentPeriodType;
    subscriptionPaymentGateway = SubscriptionPaymentGatewayType;
    selectedPaymentPeriodType: PaymentPeriodType;
    additionalPrice: number;
    editionPaymentTypeCheck: typeof EditionPaymentType = EditionPaymentType;
    paymentGateways: PaymentGatewayModel[];
    editionDetails: EditionDetailsForEditDto;
    selectedPricingType: ModulePricingDto = null;

    constructor(
        injector: Injector,
        private _router: Router,
        private _paymnetHelperService: PaymentHelperService,
        private _activatedRoute: ActivatedRoute,
        private _paymentAppService: PaymentServiceProxy,
        private _tenantRegistrationService: TenantRegistrationServiceProxy) {
        super(injector);
    }

    ngOnInit(): void {
        this.editionPaymentType = parseInt(this._activatedRoute.snapshot.queryParams['editionPaymentType']);

        this._paymentAppService.getPaymentInfo(undefined)
            .subscribe((result: PaymentInfoDto) => {
                this.edition = result.edition;
                if(this.edition != null && this.edition.id > 0){
                    this.GetEditionDetailsById(this.edition.id);
                }
                this.additionalPrice = Number(result.additionalPrice.toFixed(2));
                this.selectedPaymentPeriodType = this._paymnetHelperService.getInitialSelectedPaymentPeriodType(this.edition);
            });

        this._paymentAppService.getActiveGateways(undefined)
            .subscribe((result: PaymentGatewayModel[]) => {
                this.paymentGateways = result;
            });
    }
    GetEditionDetailsById(editionId): void {
        this._tenantRegistrationService.getEditionDetailsById(editionId).subscribe(result => {
            if (result != null && result.id > 0) {
                this.editionDetails = result; 
            }
            else{
                this.editionDetails = null;
            }
        });
    }
    checkout(gatewayType) {
        debugger
        let input = {} as CreatePaymentNewDto;
        input.editionId = this.edition.id;
        input.editionPaymentType = ((this.editionPaymentType) as any);
        input.paymentPeriodType = this.selectedPricingType.pricingTypeID;//((this.selectedPaymentPeriodType) as any);
        input.amount = this.selectedPricingType.amount - (this.selectedPricingType.amount*this.selectedPricingType.discountPercentage/100)
        input.recurringPaymentEnabled = false;
        input.subscriptionPaymentGatewayType = gatewayType;
        input.successUrl = AppConsts.remoteServiceBaseUrl + '/api/services/app/payment/' + this._paymnetHelperService.getEditionPaymentType(this.editionPaymentType) + 'Succeed';
        input.errorUrl = AppConsts.remoteServiceBaseUrl + '/api/services/app/payment/PaymentFailed';

        this._paymentAppService.createPaymentNew(input)
            .subscribe((paymentId: number) => {
                this._router.navigate(['account/' + this.getPaymentGatewayType(gatewayType).toLocaleLowerCase() + '-purchase'],
                    {
                        queryParams: {
                            paymentId: paymentId,
                            redirectUrl: 'app/admin/subscription-management'
                        }
                    });
            });
    }

    getPaymentGatewayType(gatewayType): string {
        return this._paymnetHelperService.getPaymentGatewayType(gatewayType);
    }

    onPaymentPeriodChangeChange(selectedPaymentPeriodType) {
        // this.selectedPaymentPeriodType = selectedPaymentPeriodType;
        this.selectedPricingType = selectedPaymentPeriodType;
    }

    isUpgrade(): boolean {
        return this.additionalPrice > 0;
    }
}
