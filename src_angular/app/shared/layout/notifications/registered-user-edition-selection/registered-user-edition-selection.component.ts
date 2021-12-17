import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    EditionSelectDto,
    EditionWithFeaturesDto,
    EditionsSelectOutput,
    FlatFeatureSelectDto,
    TenantRegistrationServiceProxy,
    EditionPaymentType,
    SubscriptionStartType
} from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';
import { EditionHelperService } from '@account/payment/edition-helper.service';

@Component({
  selector: 'app-registered-user-edition-selection',
  templateUrl: './registered-user-edition-selection.component.html',
  styleUrls: ['./registered-user-edition-selection.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class RegisteredUserEditionSelectionComponent extends AppComponentBase implements OnInit {

    editionsSelectOutput: EditionsSelectOutput = new EditionsSelectOutput();
    isUserLoggedIn = false;
    isSetted = false;
    editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
    subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
    /*you can change your edition icons order within editionIcons variable */
    editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];

    constructor(
        injector: Injector,
        private _tenantRegistrationService: TenantRegistrationServiceProxy,
        private _editionHelperService: EditionHelperService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.isUserLoggedIn = abp.session.userId > 0;
        this._tenantRegistrationService.getEditionsForSelectForRegisteredUser()
            .subscribe((result) => {
                this.editionsSelectOutput = result;

                if (!this.editionsSelectOutput.editionsWithFeatures || this.editionsSelectOutput.editionsWithFeatures.length <= 0) {
                    this._router.navigate(['/account/register-tenant']);
                }
            });
    }

    isFree(edition: EditionSelectDto): boolean {
        return this._editionHelperService.isEditionFree(edition);
    }

    isTrueFalseFeature(feature: FlatFeatureSelectDto): boolean {
        return feature.inputType.name === 'CHECKBOX';
    }

    featureEnabledForEdition(feature: FlatFeatureSelectDto, edition: EditionWithFeaturesDto): boolean {
        const featureValues = _filter(edition.featureValues, { name: feature.name });
        if (!featureValues || featureValues.length <= 0) {
            return false;
        }

        const featureValue = featureValues[0];
        return featureValue.value.toLowerCase() === 'true';
    }

    getFeatureValueForEdition(feature: FlatFeatureSelectDto, edition: EditionWithFeaturesDto): string {
        const featureValues = _filter(edition.featureValues, { name: feature.name });
        if (!featureValues || featureValues.length <= 0) {
            return '';
        }

        const featureValue = featureValues[0];
        return featureValue.value;
    }

    upgrade(upgradeEdition: EditionSelectDto, editionPaymentType: EditionPaymentType): void {
        this._router.navigate(['/account/upgrade'], { queryParams: { upgradeEditionId: upgradeEdition.id, editionPaymentType: editionPaymentType } });
    }
}
