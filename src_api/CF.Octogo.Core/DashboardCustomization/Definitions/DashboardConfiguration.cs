using System.Collections.Generic;
using System.Linq;
using Abp.MultiTenancy;
using CF.Octogo.Authorization;

namespace CF.Octogo.DashboardCustomization.Definitions
{
    public class DashboardConfiguration
    {
        public List<DashboardDefinition> DashboardDefinitions { get; } = new List<DashboardDefinition>();

        public List<WidgetDefinition> WidgetDefinitions { get; } = new List<WidgetDefinition>();

        public List<WidgetFilterDefinition> WidgetFilterDefinitions { get; } = new List<WidgetFilterDefinition>();

        public DashboardConfiguration()
        {
            #region FilterDefinitions

            // These are global filter which all widgets can use
            var dateRangeFilter = new WidgetFilterDefinition(
                OctogoDashboardCustomizationConsts.Filters.FilterDateRangePicker,
                "FilterDateRangePicker"
            );

            WidgetFilterDefinitions.Add(dateRangeFilter);

            // Add your filters here

            #endregion

            #region WidgetDefinitions

            // Define Widgets

            #region TenantWidgets

            var tenantWidgetsDefaultPermission = new List<string>
            {
                AppPermissions.Pages_Tenant_Dashboard
            };

            var dailySales = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.DailySales,
                "WidgetDailySales",
                side: MultiTenancySides.Tenant,
                usedWidgetFilters: new List<string> { dateRangeFilter.Id },
                permissions: tenantWidgetsDefaultPermission
            );

            var generalStats = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.GeneralStats,
                "WidgetGeneralStats",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission.Concat(new List<string>{ AppPermissions.Pages_Administration_AuditLogs }).ToList());

            var profitShare = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.ProfitShare,
                "WidgetProfitShare",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);

            var memberActivity = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.MemberActivity,
                "WidgetMemberActivity",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);

            var regionalStats = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.RegionalStats,
                "WidgetRegionalStats",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);

            var salesSummary = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.SalesSummary,
                "WidgetSalesSummary",
                usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);

            var topStats = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.TopStats,
                "WidgetTopStats",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);

            var expirationDays = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.ExpirationDays,
                "WidgetExpirationDays",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);

            var currentProductAndPackage = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.CurrentProductAndPackge,
                "CurrentProductAndPackage",
                side: MultiTenancySides.Tenant,
                permissions: tenantWidgetsDefaultPermission);
            var octoCost = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.OctoCost,
                "WidgetOctoCost",
                side: MultiTenancySides.Tenant,
                usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
                permissions: tenantWidgetsDefaultPermission);

            var awbCounts = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Tenant.AwbCounts,
                "WidgetAwbCounts",
                side: MultiTenancySides.Tenant,
                usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
                permissions: tenantWidgetsDefaultPermission);


            // WidgetDefinitions.Add(generalStats);
            // WidgetDefinitions.Add(dailySales);
            // WidgetDefinitions.Add(profitShare);
            // WidgetDefinitions.Add(memberActivity);
            // WidgetDefinitions.Add(regionalStats);
            // WidgetDefinitions.Add(topStats);
            // WidgetDefinitions.Add(salesSummary);
            WidgetDefinitions.Add(expirationDays);
            WidgetDefinitions.Add(currentProductAndPackage);
            WidgetDefinitions.Add(octoCost);
            WidgetDefinitions.Add(awbCounts);
            // Add your tenant side widgets here

            #endregion

            #region HostWidgets

            var hostWidgetsDefaultPermission = new List<string>
            {
                AppPermissions.Pages_Administration_Host_Dashboard
            };

            var incomeStatistics = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Host.IncomeStatistics,
                "WidgetIncomeStatistics",
                side: MultiTenancySides.Host,
                permissions: hostWidgetsDefaultPermission);

            var hostTopStats = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Host.TopStats,
                "WidgetTopStats",
                side: MultiTenancySides.Host,
                permissions: hostWidgetsDefaultPermission);

            var editionStatistics = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Host.EditionStatistics,
                "WidgetEditionStatistics",
                side: MultiTenancySides.Host,
                permissions: hostWidgetsDefaultPermission);

            var subscriptionExpiringTenants = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Host.SubscriptionExpiringTenants,
                "WidgetSubscriptionExpiringTenants",
                side: MultiTenancySides.Host,
                permissions: hostWidgetsDefaultPermission);

            var recentTenants = new WidgetDefinition(
                OctogoDashboardCustomizationConsts.Widgets.Host.RecentTenants,
                "WidgetRecentTenants",
                side: MultiTenancySides.Host,
                usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
                permissions: hostWidgetsDefaultPermission);

            var latestClient = new WidgetDefinition(
              OctogoDashboardCustomizationConsts.Widgets.Host.LatestClient,
              "WidgetlatestClient",
              side: MultiTenancySides.Host,
              usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
              permissions: hostWidgetsDefaultPermission);

            var octogenProducts = new WidgetDefinition(
              OctogoDashboardCustomizationConsts.Widgets.Host.OctogenProducts,
              "WidgetOctogenProducts",
              side: MultiTenancySides.Host,
              usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
              permissions: hostWidgetsDefaultPermission);
            var totalClient = new WidgetDefinition(
             OctogoDashboardCustomizationConsts.Widgets.Host.TotalClient,
             "WidgetTotalClient",
             side: MultiTenancySides.Host,
             usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
             permissions: hostWidgetsDefaultPermission);

            var planExpiration = new WidgetDefinition(
              OctogoDashboardCustomizationConsts.Widgets.Host.PlanExpiration,
              "WidgetPlanExpiration",
              side: MultiTenancySides.Host,
              usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
              permissions: hostWidgetsDefaultPermission);
            var productSegmentation = new WidgetDefinition(
              OctogoDashboardCustomizationConsts.Widgets.Host.ProductSegmentation,
              "WidgeProductSegmentation",
              side: MultiTenancySides.Host,
              usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
              permissions: hostWidgetsDefaultPermission);

            var totalRevenue = new WidgetDefinition(
             OctogoDashboardCustomizationConsts.Widgets.Host.TotalRevenue,
             "WidgeTotalRevenue",
             side: MultiTenancySides.Host,
             usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
             permissions: hostWidgetsDefaultPermission);

            var pendingPayment = new WidgetDefinition(
            OctogoDashboardCustomizationConsts.Widgets.Host.PendingPayment,
            "WidgetPendingPaymen",
            side: MultiTenancySides.Host,
            usedWidgetFilters: new List<string>() { dateRangeFilter.Id },
            permissions: hostWidgetsDefaultPermission);



            // WidgetDefinitions.Add(incomeStatistics);
            // WidgetDefinitions.Add(hostTopStats);
            // WidgetDefinitions.Add(editionStatistics);
            // WidgetDefinitions.Add(subscriptionExpiringTenants);
            // WidgetDefinitions.Add(recentTenants);
            WidgetDefinitions.Add(latestClient);
            WidgetDefinitions.Add(octogenProducts);
            WidgetDefinitions.Add(planExpiration);
            WidgetDefinitions.Add(totalClient);
            WidgetDefinitions.Add(productSegmentation);
            WidgetDefinitions.Add(totalRevenue);
            WidgetDefinitions.Add(pendingPayment);

            // Add your host side widgets here

            #endregion

            #endregion

            #region DashboardDefinitions

            // Create dashboard
            var defaultTenantDashboard = new DashboardDefinition(
                OctogoDashboardCustomizationConsts.DashboardNames.DefaultTenantDashboard,
                new List<string>
                {
                    generalStats.Id, dailySales.Id, profitShare.Id,
                    memberActivity.Id, regionalStats.Id, topStats.Id,
                    salesSummary.Id,expirationDays.Id, currentProductAndPackage.Id,
                    octoCost.Id, awbCounts.Id
                });

            DashboardDefinitions.Add(defaultTenantDashboard);

            var defaultHostDashboard = new DashboardDefinition(
                OctogoDashboardCustomizationConsts.DashboardNames.DefaultHostDashboard,
                new List<string>
                {
                    incomeStatistics.Id,
                    hostTopStats.Id,
                    editionStatistics.Id,
                    subscriptionExpiringTenants.Id,
                    recentTenants.Id,
                    latestClient.Id,
                    octogenProducts.Id,
                    planExpiration.Id,
                    totalClient.Id,
                    productSegmentation.Id,
                    totalRevenue.Id,
                    pendingPayment.Id

                }) ;

            DashboardDefinitions.Add(defaultHostDashboard);

            // Add your dashboard definiton here

            #endregion

        }

    }
}
