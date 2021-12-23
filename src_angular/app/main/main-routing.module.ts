import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from '@app/shared/common/auth/auth-route-guard';
import { TenantDashboardComponent } from './tenant-dashboard/tenant-dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'tenant-dashboard', component: TenantDashboardComponent },
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                        data: { permission: 'Pages.Tenant.Dashboard1' }
                    },
                    // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    // { path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
