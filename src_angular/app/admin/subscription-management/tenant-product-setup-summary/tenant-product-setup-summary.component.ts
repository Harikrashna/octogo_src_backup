import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantDetailsServiceProxy, TenantSummaryInputDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tenant-product-setup-summary',
  templateUrl: './tenant-product-setup-summary.component.html',
  styleUrls: ['./tenant-product-setup-summary.component.css']
})
export class TenantProductSetupSummaryComponent extends AppComponentBase implements OnInit {
  @ViewChild('tenantSetupModal', { static: true }) modal: ModalDirective;
  TenantSetupData = null;
  recordFetchd = false;
  ProductName;
  constructor(injector: Injector,private _tenantsDetailService: TenantDetailsServiceProxy) {
    super(injector);
   }

  ngOnInit(): void {
  }
  Show(productId, productName){
    this.modal.show();
    this.ProductName = productName;
    this.GetTenantProcessLogSummary(productId);
  }
  GetTenantProcessLogSummary(productId): void {
    this.TenantSetupData = null;
    this.recordFetchd = false;
    let input = new TenantSummaryInputDto();
        input.tenantId = this.appSession.tenant.id;
        input.productId = productId;
        input.maxResultCount = 10;
        input.skipCount = 0;
        this._tenantsDetailService.tenantAdminSetupProcessCompleteStatus(input)
          .subscribe(result => {
            this.recordFetchd = true;
            if( result != null){
                this.TenantSetupData = result;
            }
            else{
              this.TenantSetupData = {
                    "adminCreationCompleteDt": null,
                    "adminEmail": null,
                    "adminName": null,
                    "apiURL": null,
                    "apiurlSetupCompleteDt": null,
                    "appURAL": null,
                    "appURLSetupCompleteDt": null,
                    "applicationHostDt": null,
                    "dbName": null,
                    "dbSetupCompleteDt": null,
                    "errorMessage": null,
                    "isAPIURLSetup": false,
                    "isAdminCreationCompleted": false,
                    "isAppURLSetup": false,
                    "isApplicationHost": false,
                    "isDBSetup": false,
                    "isWSSetup": false,
                    "productId": 1,
                    "productName": this.ProductName,
                    "tenantId": this.appSession.tenant.id,
                    "tenantName": this.appSession.tenant.name,
                    "wsSetupCompleteDt": null
              }
            }
        });
}
close(): void {
  this.modal.hide();
}
}
