import { PermissionCheckerService } from 'abp-ng2-module';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Injectable()
export class AccountRouteGuard implements CanActivate {

    constructor(
        private _permissionChecker: PermissionCheckerService,
        private _router: Router,
        private _sessionService: AppSessionService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (route.queryParams['ss'] && route.queryParams['ss'] === 'true') {
            return true;
        }

        if (this._sessionService.user) {
            this._router.navigate([this.selectBestRoute()]);
            return false;
        }

        return true;
    }

    selectBestRoute(): string {
        if (this._permissionChecker.isGranted('Pages.Administration.Host.Dashboard')) {
            return '/app/admin/hostDashboard';
        }
        // if (this._permissionChecker.isGranted('Pages.Tenant.Dashboard')) {
        //     return '/app/main/dashboard';
        // }
        // Added By : Hari Krashna (only for Signed Up User)
        else if (this._permissionChecker.isGranted('Pages.isdefaultRegisterUser')) {
            return '/app/registered-user';
        }
        // Added By : Hari Krashna (only for Signed Up User(who SignedUp on Host, later transffered to Tenant))
        // this functionality will build using setting management
        else if (this._sessionService.tenant != null && this._sessionService.tenant != undefined && this._sessionService.tenant.id > 0) {
            return this.getTenantDefaultdashBoard();;
        }
        return '/app/notifications';
    }
    getTenantDefaultdashBoard(): string {
        return '/app/main/tenant-dashboard';
    }
}
