import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    TenantRegistrationServiceProxy,
    EditionPaymentType,
    SubscriptionStartType,
    ProductWithEditionDto,
    EditionList
} from '@shared/service-proxies/service-proxies';
import { filter as _filter } from 'lodash-es';

@Component({
  selector: 'app-registered-user-edition-selection',
  templateUrl: './registered-user-edition-selection.component.html',
  styleUrls: ['./registered-user-edition-selection.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [accountModuleAnimation()]
})
export class RegisteredUserEditionSelectionComponent extends AppComponentBase implements OnInit {

    isUserLoggedIn = false;
    editionPaymentType: typeof EditionPaymentType = EditionPaymentType;
    subscriptionStartType: typeof SubscriptionStartType = SubscriptionStartType;
    ProductWithEditionList:ProductWithEditionDto[];
    /*you can change your edition icons order within editionIcons variable */
    editionIcons: string[] = ['flaticon-open-box', 'flaticon-rocket', 'flaticon-gift', 'flaticon-confetti', 'flaticon-cogwheel-2', 'flaticon-app', 'flaticon-coins', 'flaticon-piggy-bank', 'flaticon-bag', 'flaticon-lifebuoy', 'flaticon-technology-1', 'flaticon-cogwheel-1', 'flaticon-infinity', 'flaticon-interface-5', 'flaticon-squares-3', 'flaticon-interface-6', 'flaticon-mark', 'flaticon-business', 'flaticon-interface-7', 'flaticon-list-2', 'flaticon-bell', 'flaticon-technology', 'flaticon-squares-2', 'flaticon-notes', 'flaticon-profile', 'flaticon-layers', 'flaticon-interface-4', 'flaticon-signs', 'flaticon-menu-1', 'flaticon-symbol'];
  

    constructor(
        injector: Injector,
        private _tenantRegistrationService: TenantRegistrationServiceProxy,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.isUserLoggedIn = abp.session.userId > 0;
        this.GetProductEditionData();
    }
  
    GetProductEditionData() {
        this.spinnerService.show();
      this._tenantRegistrationService.getProductWithEdition().subscribe(result=>{
        this.spinnerService.hide();
          if(result != null){
        this.ProductWithEditionList=result;
          }
          else{
            this.ProductWithEditionList = [];  
          }
      })
    }
    isFree(pricingData?): boolean{
      if(pricingData != null && pricingData.length > 0){
        return false;
      }
      return true;
    }

    upgrade(upgradeEdition: EditionList, editionPaymentType: EditionPaymentType): void {
        this._router.navigate(['/account/upgrade'], { queryParams: { upgradeEditionId: upgradeEdition.editionID, editionPaymentType: editionPaymentType } });
    }
}
