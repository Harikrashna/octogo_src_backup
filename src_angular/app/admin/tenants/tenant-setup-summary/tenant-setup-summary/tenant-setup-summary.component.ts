import { Component, EventEmitter, Injector, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TenantDetailsServiceProxy, TenantSummaryInputDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'tenant-setup-summary',
    templateUrl: './tenant-setup-summary.component.html',
    styleUrls: ['./tenant-setup-summary.component.css'],
})
export class TenantSetupSummaryComponent extends AppComponentBase implements OnInit {

    @ViewChild('createSummary', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    active = false;
    saving = false;
    tenantStatusData = [];
    tenantName;
    statusCode: any = null;
    maxResultCount = 10;
    skipCount = 0;
    totalRecordCount: number;
    recordFetchd = false;
    tenantSetupStatus = [];
    constructor(
        injector: Injector, private _tenantsDetailService: TenantDetailsServiceProxy, private _router: Router,) {
        super(injector);
    }
    ngOnInit() {
        this.tenantSetupStatus = [
            { "name": this.l("Completed"), "code": "CMP", "seqNo": 1 },
            { "name": this.l("Failed"), "code": "FLD", "seqNo": 2 },
            { "name": this.l("Processing"), "code": "PROC", "seqNo": 3 },
            { "name": this.l("Database"), "code": "DS", "seqNo": 4 },
            { "name": this.l("AppUrlSetup"), "code": "AUS", "seqNo": 5 },
            { "name": this.l("WSsetup"), "code": "WSS", "seqNo": 6 },
            { "name": this.l("apiurlSetup"), "code": "AURLS", "seqNo": 7 },
            { "name": this.l("serviceHoasted"), "code": "SH", "seqNo": 8 }
        ]
        this.active = true;
        this.GetTenantProcessLogSummary();
    }

    Search() {
        this.skipCount = 0;
        this.GetTenantProcessLogSummary();
    }
    Refresh() {
        this.tenantName = null;
        this.statusCode = null;
        this.skipCount = 0;
        this.GetTenantProcessLogSummary();
    }

    Back() {
        this._router.navigate(['app/admin/tenants'])
    }
    GetTenantProcessLogSummary(): void {
        this.recordFetchd = false;
        if (this.skipCount == 0) {
            this.tenantStatusData = [];
        }
        let input = new TenantSummaryInputDto();
        input.maxResultCount = this.maxResultCount;
        input.skipCount = this.skipCount;
        input.tenantName = this.tenantName;
        input.isDBSetup = this.statusCode != null && this.statusCode.code == "DS" ? true : null;
        input.isAppURLSetup = this.statusCode != null && this.statusCode.code == "AUS" ? true : null;
        input.isWSSetup = this.statusCode != null && this.statusCode.code == "WSS" ? true : null;
        input.isApiURLSetUp = this.statusCode != null && this.statusCode.code == "AURLS" ? true : null;
        input.isAppHosted = this.statusCode != null && this.statusCode.code == "SH" ? true : null;
        input.isCompleted = this.statusCode != null && this.statusCode.code == "CMP" ? true : null;
        input.isFailed = this.statusCode != null && this.statusCode.code == "FLD" ? true : null;
        input.isProcess = this.statusCode != null && this.statusCode.code == "PROC" ? true : null;
        this._tenantsDetailService.tenantAdminSetupProcessCompleteStatus(input)
            .subscribe(result => {
                this.recordFetchd = true;
                if (result != null) {
                    this.totalRecordCount = result.table[0].totalCount
                    if (this.skipCount > 0) {
                        this.tenantStatusData = this.tenantStatusData.concat(result.table);
                    }
                    else {
                        this.tenantStatusData = result.table;
                    }
                }
            });
    }
    close(): void {
        this.active = false;
        this.modal.hide();
        this.tenantName = null
        this.skipCount = 0
        this.statusCode = null;
    }
    ViewMore() {
        this.skipCount++;
        this.GetTenantProcessLogSummary();
    }
}