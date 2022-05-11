import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { Router } from '@angular/router';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class DashboardComponent extends AppComponentBase {
    dashboardName = DashboardCustomizationConst.dashboardNames.defaultTenantDashboard;

    constructor(
        injector: Injector, private _router: Router,) {
        super(injector);
        if(this.appSession.user.userTypeName.toUpperCase() != "AIRLINE")
        {
            this._router.navigate(["/app/main/tenant-dashboard"]);
        }
    }
}
