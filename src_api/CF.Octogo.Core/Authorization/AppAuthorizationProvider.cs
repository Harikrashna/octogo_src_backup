using Abp.Authorization;
using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.MultiTenancy;

namespace CF.Octogo.Authorization
{
    /// <summary>
    /// Application's authorization provider.
    /// Defines permissions for the application.
    /// See <see cref="AppPermissions"/> for all permission names.
    /// </summary>
    public class AppAuthorizationProvider : AuthorizationProvider
    {
        private readonly bool _isMultiTenancyEnabled;

        public AppAuthorizationProvider(bool isMultiTenancyEnabled)
        {
            _isMultiTenancyEnabled = isMultiTenancyEnabled;
        }

        public AppAuthorizationProvider(IMultiTenancyConfig multiTenancyConfig)
        {
            _isMultiTenancyEnabled = multiTenancyConfig.IsEnabled;
        }

        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            //COMMON PERMISSIONS (FOR BOTH OF TENANTS AND HOST)

            var pages = context.GetPermissionOrNull(AppPermissions.Pages) ?? context.CreatePermission(AppPermissions.Pages, L("Pages"));
            pages.CreateChildPermission(AppPermissions.Pages_DemoUiComponents, L("DemoUiComponents"));
            pages.CreateChildPermission(AppPermissions.Pages_isdefaultRegisterUser, L("SignedUpUserPermission"), multiTenancySides: MultiTenancySides.Host );

            var administration = pages.CreateChildPermission(AppPermissions.Pages_Administration, L("Administration"));

            var roles = administration.CreateChildPermission(AppPermissions.Pages_Administration_Roles, L("Roles"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Create, L("CreatingNewRole"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Edit, L("EditingRole"));
            roles.CreateChildPermission(AppPermissions.Pages_Administration_Roles_Delete, L("DeletingRole"));

            var users = administration.CreateChildPermission(AppPermissions.Pages_Administration_Users, L("Users"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Create, L("CreatingNewUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Edit, L("EditingUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Delete, L("DeletingUser"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_ChangePermissions, L("ChangingPermissions"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Impersonation, L("LoginForUsers"));
            users.CreateChildPermission(AppPermissions.Pages_Administration_Users_Unlock, L("Unlock"));

            var languages = administration.CreateChildPermission(AppPermissions.Pages_Administration_Languages, L("Languages"));
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Create, L("CreatingNewLanguage"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Edit, L("EditingLanguage"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_Delete, L("DeletingLanguages"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_ChangeTexts, L("ChangingTexts"));
            languages.CreateChildPermission(AppPermissions.Pages_Administration_Languages_ChangeDefaultLanguage, L("ChangeDefaultLanguage"));
            
            administration.CreateChildPermission(AppPermissions.Pages_Administration_AuditLogs, L("AuditLogs"));

            var organizationUnits = administration.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits, L("OrganizationUnits"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageOrganizationTree, L("ManagingOrganizationTree"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageMembers, L("ManagingMembers"));
            organizationUnits.CreateChildPermission(AppPermissions.Pages_Administration_OrganizationUnits_ManageRoles, L("ManagingRoles"));

            administration.CreateChildPermission(AppPermissions.Pages_Administration_UiCustomization, L("VisualSettings"));

            var webhooks = administration.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription, L("Webhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Create, L("CreatingWebhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Edit, L("EditingWebhooks"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_ChangeActivity, L("ChangingWebhookActivity"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_WebhookSubscription_Detail, L("DetailingSubscription"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_Webhook_ListSendAttempts, L("ListingSendAttempts"));
            webhooks.CreateChildPermission(AppPermissions.Pages_Administration_Webhook_ResendWebhook, L("ResendingWebhook"));

            var dynamicProperties = administration.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties, L("DynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Create, L("CreatingDynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Edit, L("EditingDynamicProperties"));
            dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicProperties_Delete, L("DeletingDynamicProperties"));

            var dynamicPropertyValues = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue, L("DynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Create, L("CreatingDynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Edit, L("EditingDynamicPropertyValue"));
            dynamicPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicPropertyValue_Delete, L("DeletingDynamicPropertyValue"));

            var dynamicEntityProperties = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties, L("DynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Create, L("CreatingDynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Edit, L("EditingDynamicEntityProperties"));
            dynamicEntityProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityProperties_Delete, L("DeletingDynamicEntityProperties"));

            var dynamicEntityPropertyValues = dynamicProperties.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue, L("EntityDynamicPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Create, L("CreatingDynamicEntityPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Edit, L("EditingDynamicEntityPropertyValue"));
            dynamicEntityPropertyValues.CreateChildPermission(AppPermissions.Pages_Administration_DynamicEntityPropertyValue_Delete, L("DeletingDynamicEntityPropertyValue"));

            //TENANT-SPECIFIC PERMISSIONS

            pages.CreateChildPermission(AppPermissions.Pages_Tenant_Dashboard, L("Dashboard"), multiTenancySides: MultiTenancySides.Tenant);

            administration.CreateChildPermission(AppPermissions.Pages_Administration_Tenant_Settings, L("Settings"), multiTenancySides: MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Tenant_SubscriptionManagement, L("Subscription"), multiTenancySides: MultiTenancySides.Tenant);

            //HOST-SPECIFIC PERMISSIONS

            var editions = pages.CreateChildPermission(AppPermissions.Pages_Editions, L("Editions"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Create, L("CreatingNewEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Edit, L("EditingEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_Delete, L("DeletingEdition"), multiTenancySides: MultiTenancySides.Host);
            editions.CreateChildPermission(AppPermissions.Pages_Editions_MoveTenantsToAnotherEdition, L("MoveTenantsToAnotherEdition"), multiTenancySides: MultiTenancySides.Host);

            var tenants = pages.CreateChildPermission(AppPermissions.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Create, L("CreatingNewTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Edit, L("EditingTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_ChangeFeatures, L("ChangingFeatures"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Delete, L("DeletingTenant"), multiTenancySides: MultiTenancySides.Host);
            tenants.CreateChildPermission(AppPermissions.Pages_Tenants_Impersonation, L("LoginForTenants"), multiTenancySides: MultiTenancySides.Host);

            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Settings, L("Settings"), multiTenancySides: MultiTenancySides.Host);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Maintenance, L("Maintenance"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_HangfireDashboard, L("HangfireDashboard"), multiTenancySides: _isMultiTenancyEnabled ? MultiTenancySides.Host : MultiTenancySides.Tenant);
            administration.CreateChildPermission(AppPermissions.Pages_Administration_Host_Dashboard, L("Dashboard"), multiTenancySides: MultiTenancySides.Host);

            var addons = pages.CreateChildPermission(AppPermissions.Pages_Addons, L("Addons"), multiTenancySides: MultiTenancySides.Host);
            addons.CreateChildPermission(AppPermissions.Pages_Addons_Create, L("CreatingNewAddon"), multiTenancySides: MultiTenancySides.Host);
            addons.CreateChildPermission(AppPermissions.Pages_Addons_Edit, L("EditingAddon"), multiTenancySides: MultiTenancySides.Host);
            addons.CreateChildPermission(AppPermissions.Pages_Addons_Delete, L("DeletingAddon"), multiTenancySides: MultiTenancySides.Host);

            var masters = administration.CreateChildPermission(AppPermissions.Pages_Administration_Master, L("Master"), multiTenancySides: MultiTenancySides.Host);

            var pricingType = masters.CreateChildPermission(AppPermissions.Pages_Administration_PricingType, L("PricingType"), multiTenancySides: MultiTenancySides.Host);
            pricingType.CreateChildPermission(AppPermissions.Pages_Administration_CreatePricingType, L("CreatePricingType"), multiTenancySides: MultiTenancySides.Host);
            pricingType.CreateChildPermission(AppPermissions.Pages_Administration_EditPricingType, L("EditPricingType"), multiTenancySides: MultiTenancySides.Host);
            pricingType.CreateChildPermission(AppPermissions.Pages_Administration_DeletePricingType, L("DeletePricingType"), multiTenancySides: MultiTenancySides.Host);

            var priceApproach = masters.CreateChildPermission(AppPermissions.Pages_Administration_PriceApproach, L("PriceApproach"));
            priceApproach.CreateChildPermission(AppPermissions.Pages_Administration_PriceApproach_Create, L("CreatingNewPriceApproach"));
            priceApproach.CreateChildPermission(AppPermissions.Pages_Administration_PriceApproach_Edit, L("EditingPriceApproach"));
            priceApproach.CreateChildPermission(AppPermissions.Pages_Administration_PriceApproach_Delete, L("DeletePricingApproach"));

            //AWB-COST-APPROACH-PERMISSIONS
            var awbcostapproach = masters.CreateChildPermission(AppPermissions.Pages_Administration_AwbCostApproach, L("AwbCostApproach"), multiTenancySides: MultiTenancySides.Host);
            awbcostapproach.CreateChildPermission(AppPermissions.Pages_Administration_AwbCostApproach_Create, L("CreatingNewAwbCostApproach"), multiTenancySides: MultiTenancySides.Host);
            awbcostapproach.CreateChildPermission(AppPermissions.Pages_Administration_AwbCostApproach_Edit, L("EditingAwbCostApproach"), multiTenancySides: MultiTenancySides.Host);
            awbcostapproach.CreateChildPermission(AppPermissions.Pages_Administration_AwbCostApproach_Delete, L("DeletingAwbCostApproach"), multiTenancySides: MultiTenancySides.Host);

            var product = masters.CreateChildPermission(AppPermissions.Pages_Administration_Product, L("Product"), multiTenancySides: MultiTenancySides.Host);
            product.CreateChildPermission(AppPermissions.Pages_Administration_Product_CreateProduct, L("CreatingNewProduct"), multiTenancySides: MultiTenancySides.Host);
            product.CreateChildPermission(AppPermissions.Pages_Administration_Product_Edit, L("EditingProduct"), multiTenancySides: MultiTenancySides.Host);
            product.CreateChildPermission(AppPermissions.Pages_Administration_Product_Delete, L("DeletingProduct"), multiTenancySides: MultiTenancySides.Host);

            var department = masters.CreateChildPermission(AppPermissions.Pages_Administration_Department, L("Department"), multiTenancySides: MultiTenancySides.Host);
            department.CreateChildPermission(AppPermissions.Pages_Administration_Department_CreateDepartment, L("CreatingNewDepartment"), multiTenancySides: MultiTenancySides.Host);
            department.CreateChildPermission(AppPermissions.Pages_Administration_Department_Edit, L("EditingDepartment"), multiTenancySides: MultiTenancySides.Host);
            department.CreateChildPermission(AppPermissions.Pages_Administration_Department_Delete, L("DeletingDepartment"), multiTenancySides: MultiTenancySides.Host);

            var usertype = masters.CreateChildPermission(AppPermissions.Pages_Administration_UserType, L("UserType"), multiTenancySides: MultiTenancySides.Host);
            usertype.CreateChildPermission(AppPermissions.Pages_Administration_UserType_CreateUserType, L("CreatingNewUserType"), multiTenancySides: MultiTenancySides.Host);
            usertype.CreateChildPermission(AppPermissions.Pages_Administration_UserType_Edit, L("EditingUserType"), multiTenancySides: MultiTenancySides.Host);
            usertype.CreateChildPermission(AppPermissions.Pages_Administration_UserType_Delete, L("DeletingUserType"), multiTenancySides: MultiTenancySides.Host);


            var services = masters.CreateChildPermission(AppPermissions.Pages_Administration_Services, L("Services"), multiTenancySides: MultiTenancySides.Host);
            services.CreateChildPermission(AppPermissions.Pages_Administration_Services_CreateServices, L("CreatingNewServices"), multiTenancySides: MultiTenancySides.Host);
            services.CreateChildPermission(AppPermissions.Pages_Administration_Services_Edit, L("EditingServices"), multiTenancySides: MultiTenancySides.Host);
            services.CreateChildPermission(AppPermissions.Pages_Administration_Services_Delete, L("DeletingServices"), multiTenancySides: MultiTenancySides.Host);

            var airline = masters.CreateChildPermission(AppPermissions.Pages_Administration_Airline, L("Airline"), multiTenancySides: MultiTenancySides.Host);
            airline.CreateChildPermission(AppPermissions.Pages_Administration_Airline_Create, L("CreatingNewAirline"), multiTenancySides: MultiTenancySides.Host);
            airline.CreateChildPermission(AppPermissions.Pages_Administration_Airline_Edit, L("EditingAirline"), multiTenancySides: MultiTenancySides.Host);
            airline.CreateChildPermission(AppPermissions.Pages_Administration_Airline_Delete, L("DeletingAirline"), multiTenancySides: MultiTenancySides.Host);

            var industry = masters.CreateChildPermission(AppPermissions.Pages_Administration_Industry, L("Industry"), multiTenancySides: MultiTenancySides.Host);
            industry.CreateChildPermission(AppPermissions.Pages_Administration_Industry_CreateIndustry, L("CreatingNewIndustry"), multiTenancySides: MultiTenancySides.Host);
            industry.CreateChildPermission(AppPermissions.Pages_Administration_Industry_Edit, L("EditingIndustry"), multiTenancySides: MultiTenancySides.Host);
            industry.CreateChildPermission(AppPermissions.Pages_Administration_Industry_Delete, L("DeletingIndustry"), multiTenancySides: MultiTenancySides.Host);

            var designation = masters.CreateChildPermission(AppPermissions.Pages_Administration_Designation, L("Designation"), multiTenancySides: MultiTenancySides.Host);
            designation.CreateChildPermission(AppPermissions.Pages_Administration_Designation_Create, L("CreatingNewDesignation"), multiTenancySides: MultiTenancySides.Host);
            designation.CreateChildPermission(AppPermissions.Pages_Administration_Designation_Edit, L("EditDesignation"), multiTenancySides: MultiTenancySides.Host);
            designation.CreateChildPermission(AppPermissions.Pages_Administration_Designation_Delete, L("DeleteDesignation"), multiTenancySides: MultiTenancySides.Host);

            var city = masters.CreateChildPermission(AppPermissions.Pages_Administration_City, L("City"), multiTenancySides: MultiTenancySides.Host);
            city.CreateChildPermission(AppPermissions.Pages_Administration_City_Create, L("CreatingNewAwbCostApproach"), multiTenancySides: MultiTenancySides.Host);
            city.CreateChildPermission(AppPermissions.Pages_Administration_City_Edit, L("EditingAwbCostApproach"), multiTenancySides: MultiTenancySides.Host);
            city.CreateChildPermission(AppPermissions.Pages_Administration_City_Delete, L("DeletingAwbCostApproach"), multiTenancySides: MultiTenancySides.Host);

            var country = masters.CreateChildPermission(AppPermissions.Pages_Administration_Country, L("Country"), multiTenancySides: MultiTenancySides.Host);
            country.CreateChildPermission(AppPermissions.Pages_Administration_Country_Create, L("CreateNewCountry"), multiTenancySides: MultiTenancySides.Host);
            country.CreateChildPermission(AppPermissions.Pages_Administration_Country_Edit, L("EditCountry"), multiTenancySides: MultiTenancySides.Host);
            country.CreateChildPermission(AppPermissions.Pages_Administration_Country_Delete, L("DeleteCountry"), multiTenancySides: MultiTenancySides.Host);
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, OctogoConsts.LocalizationSourceName);
        }
    }
}
