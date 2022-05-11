export class DashboardCustomizationConst {
    static widgets = {
        tenant: {
            profitShare: 'Widgets_Tenant_ProfitShare',
            memberActivity: 'Widgets_Tenant_MemberActivity',
            regionalStats: 'Widgets_Tenant_RegionalStats',
            salesSummary: 'Widgets_Tenant_SalesSummary',
            topStats: 'Widgets_Tenant_TopStats',
            generalStats: 'Widgets_Tenant_GeneralStats',
            dailySales: 'Widgets_Tenant_DailySales',
            expirationDays: 'Widgets_Tenant_ExpirationDays',
            currentProductAndPackage : 'Widgets_Tenant_CurrentProductAndPackage',
            octoCost :'Widgets_Tenant_OctoCost'
        },
        host: {
            topStats: 'Widgets_Host_TopStats',
            incomeStatistics: 'Widgets_Host_IncomeStatistics',
            editionStatistics: 'Widgets_Host_EditionStatistics',
            subscriptionExpiringTenants: 'Widgets_Host_SubscriptionExpiringTenants',
            recentTenants: 'Widgets_Host_RecentTenants',
            latestClient:'Widgets_Host_LatestClient',
            octogenProducts:'Widget_Host_OctogenProducts',
            planExpiration:'Widget_Host_PlanExpiration',
            totalClient:'Widget_Host_TotalClient',
            productSegmentation:'Widget_Host_ProductSegmentation',
            totalRevenue:'Widget_Host_TotalRevenue',
            pendingPayment:'Widget_Host_PendingPayment'
            
        }
    };
    static filters = {
        filterDateRangePicker: 'Filters_DateRangePicker'
    };
    static dashboardNames = {
        defaultTenantDashboard: 'TenantDashboard',
        defaultHostDashboard: 'HostDashboard',
    };
    static Applications = {
        Angular: 'Angular'
    };
}
