using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using Abp;
using Abp.Application.Features;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.IdentityFramework;
using Abp.MultiTenancy;
using CF.Octogo.Authorization.Roles;
using CF.Octogo.Authorization.Users;
using CF.Octogo.Editions;
using CF.Octogo.MultiTenancy.Demo;
using Abp.Extensions;
using Abp.Notifications;
using Abp.Runtime.Security;
using Microsoft.AspNetCore.Identity;
using CF.Octogo.Notifications;
using System;
using System.Diagnostics;
using Abp.BackgroundJobs;
using Abp.Localization;
using Abp.Runtime.Session;
using Abp.UI;
using CF.Octogo.MultiTenancy.Payments;
using Abp.Authorization;
using System.Collections.Generic;
using CF.Octogo.Data;
using System.Data.SqlClient;
using CF.Octogo.MultiTenancy.Dto;

namespace CF.Octogo.MultiTenancy
{
    /// <summary>
    /// Tenant manager.
    /// </summary>
    public class TenantManager : AbpTenantManager<Tenant, User>
    {
        public IAbpSession AbpSession { get; set; }

        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly RoleManager _roleManager;
        private readonly UserManager _userManager;
        private readonly IUserEmailer _userEmailer;
        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;
        private readonly IAppNotifier _appNotifier;
        private readonly IAbpZeroDbMigrator _abpZeroDbMigrator;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IRepository<SubscribableEdition> _subscribableEditionRepository;
        protected readonly IBackgroundJobManager _backgroundJobManager;
        private readonly IRepository<User, long> _userRepository;

        public TenantManager(
            IRepository<Tenant> tenantRepository,
            IRepository<TenantFeatureSetting, long> tenantFeatureRepository,
            EditionManager editionManager,
            IUnitOfWorkManager unitOfWorkManager,
            RoleManager roleManager,
            IUserEmailer userEmailer,
            UserManager userManager,
            INotificationSubscriptionManager notificationSubscriptionManager,
            IAppNotifier appNotifier,
            IAbpZeroFeatureValueStore featureValueStore,
            IAbpZeroDbMigrator abpZeroDbMigrator,
            IPasswordHasher<User> passwordHasher,
            IRepository<SubscribableEdition> subscribableEditionRepository,
            IBackgroundJobManager backgroundJobManager,
            IRepository<User, long> userRepository) : base(
                tenantRepository,
                tenantFeatureRepository,
                editionManager,
                featureValueStore
            )
        {
            AbpSession = NullAbpSession.Instance;

            _unitOfWorkManager = unitOfWorkManager;
            _roleManager = roleManager;
            _userEmailer = userEmailer;
            _userManager = userManager;
            _notificationSubscriptionManager = notificationSubscriptionManager;
            _appNotifier = appNotifier;
            _abpZeroDbMigrator = abpZeroDbMigrator;
            _passwordHasher = passwordHasher;
            _subscribableEditionRepository = subscribableEditionRepository;
            _backgroundJobManager = backgroundJobManager;
            _userRepository = userRepository;
        }

        public async Task<int> CreateWithAdminUserAsync(
            string tenancyName,
            string name,
            string adminPassword,
            string adminEmailAddress,
            string connectionString,
            bool isActive,
            int? editionId,
            bool shouldChangePasswordOnNextLogin,
            bool sendActivationEmail,
            DateTime? subscriptionEndDate,
            bool isInTrialPeriod,
            string emailActivationLink)
        {
            int newTenantId;
            long newAdminId;



            await CheckEditionAsync(editionId, isInTrialPeriod);

            if (isInTrialPeriod && !subscriptionEndDate.HasValue)
            {
                throw new UserFriendlyException(LocalizationManager.GetString(OctogoConsts.LocalizationSourceName, "TrialWithoutEndDateErrorMessage"));
            }

            using (var uow = _unitOfWorkManager.Begin(TransactionScopeOption.RequiresNew))
            {
                User existingUser = await CheckEmailIdAsync(adminEmailAddress);
                //Create tenant
                var tenant = new Tenant(tenancyName, name)
                {
                    IsActive = isActive,
                    EditionId = editionId,
                    SubscriptionEndDateUtc = subscriptionEndDate?.ToUniversalTime(),
                    IsInTrialPeriod = isInTrialPeriod,
                    ConnectionString = connectionString.IsNullOrWhiteSpace() ? null : SimpleStringCipher.Instance.Encrypt(connectionString)
                };

                await CreateAsync(tenant);
                await _unitOfWorkManager.Current.SaveChangesAsync(); //To get new tenant's id.

                //Create tenant database
                _abpZeroDbMigrator.CreateOrMigrateForTenant(tenant);

                //We are working entities of new tenant, so changing tenant filter
                using (_unitOfWorkManager.Current.SetTenantId(tenant.Id))
                {
                    //Create static roles for new tenant
                    CheckErrors(await _roleManager.CreateStaticRoles(tenant.Id));
                    await _unitOfWorkManager.Current.SaveChangesAsync(); //To get static role ids

                    //grant all permissions to admin role
                    var adminRole = _roleManager.Roles.Single(r => r.Name == StaticRoleNames.Tenants.Admin);
                    await _roleManager.GrantAllPermissionsAsync(adminRole);

                    //"User" role should be default
                    var userRole = _roleManager.Roles.Single(r => r.Name == StaticRoleNames.Tenants.User);
                    userRole.IsDefault = true;
                    CheckErrors(await _roleManager.UpdateAsync(userRole));

                    //Create admin user for the tenant
                    var adminUser = User.CreateTenantAdminUser(tenant.Id, adminEmailAddress);
                    adminUser.ShouldChangePasswordOnNextLogin = shouldChangePasswordOnNextLogin;
                    adminUser.IsActive = true;

                    if (adminPassword.IsNullOrEmpty())
                    {
                        adminPassword = await _userManager.CreateRandomPassword();
                    }
                    else
                    {
                        await _userManager.InitializeOptionsAsync(AbpSession.TenantId);
                        foreach (var validator in _userManager.PasswordValidators)
                        {
                            CheckErrors(await validator.ValidateAsync(_userManager, adminUser, adminPassword));
                        }

                    }

                    adminUser.Password = _passwordHasher.HashPassword(adminUser, adminPassword);
                    adminUser.UserName = GetUserName(adminEmailAddress, tenancyName);
                    adminUser.NormalizedUserName = adminUser.UserName.ToUpper();

                    // if SignUp user is Admin for new Tenant
                    if (existingUser != null && existingUser.EmailAddress.Trim().ToUpper() == adminEmailAddress.Trim().ToUpper())
                    {
                        adminUser.Name = existingUser.Name;
                        adminUser.Surname = existingUser.Surname;
                    }

                    CheckErrors(await _userManager.CreateAsync(adminUser));
                    await _unitOfWorkManager.Current.SaveChangesAsync(); //To get admin user's id

                    //Assign admin user to admin role!
                    CheckErrors(await _userManager.AddToRoleAsync(adminUser, adminRole.Name));

                    //Notifications
                    await _appNotifier.WelcomeToTheApplicationAsync(adminUser);

                    //Send activation email
                    if (sendActivationEmail)
                    {
                        adminUser.SetNewEmailConfirmationCode();
                        await _userEmailer.SendEmailActivationLinkAsync(adminUser, emailActivationLink, adminPassword);
                    }

                    await _unitOfWorkManager.Current.SaveChangesAsync();

                    await _backgroundJobManager.EnqueueAsync<TenantDemoDataBuilderJob, int>(tenant.Id);

                    newTenantId = tenant.Id;
                    newAdminId = adminUser.Id;
                }

                await uow.CompleteAsync();
            }

            //Used a second UOW since UOW above sets some permissions and _notificationSubscriptionManager.SubscribeToAllAvailableNotificationsAsync needs these permissions to be saved.
            using (var uow = _unitOfWorkManager.Begin(TransactionScopeOption.RequiresNew))
            {
                using (_unitOfWorkManager.Current.SetTenantId(newTenantId))
                {
                    await _notificationSubscriptionManager.SubscribeToAllAvailableNotificationsAsync(new UserIdentifier(newTenantId, newAdminId));
                    await _unitOfWorkManager.Current.SaveChangesAsync();
                    await uow.CompleteAsync();
                }
            }

            return newTenantId;
        }

        public async Task CheckEditionAsync(int? editionId, bool isInTrialPeriod)
        {
            if (!editionId.HasValue || !isInTrialPeriod)
            {
                return;
            }

            var edition = await _subscribableEditionRepository.GetAsync(editionId.Value);
            if (!edition.IsFree)
            {
                return;
            }

            var error = LocalizationManager.GetSource(OctogoConsts.LocalizationSourceName).GetString("FreeEditionsCannotHaveTrialVersions");
            throw new UserFriendlyException(error);
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        public decimal GetUpgradePrice(SubscribableEdition currentEdition, SubscribableEdition targetEdition, int totalRemainingHourCount, PaymentPeriodType paymentPeriodType)
        {
            int numberOfHoursPerDay = 24;

            var totalRemainingDayCount = totalRemainingHourCount / numberOfHoursPerDay;
            var unusedPeriodCount = totalRemainingDayCount / (int)paymentPeriodType;
            var unusedHoursCount = totalRemainingHourCount % ((int)paymentPeriodType * numberOfHoursPerDay);

            decimal currentEditionPriceForUnusedPeriod = 0;
            decimal targetEditionPriceForUnusedPeriod = 0;

            var currentEditionPrice = currentEdition.GetPaymentAmount(paymentPeriodType);
            var targetEditionPrice = targetEdition.GetPaymentAmount(paymentPeriodType);

            if (currentEditionPrice > 0)
            {
                currentEditionPriceForUnusedPeriod = currentEditionPrice * unusedPeriodCount;
                currentEditionPriceForUnusedPeriod += (currentEditionPrice / (int)paymentPeriodType) / numberOfHoursPerDay * unusedHoursCount;
            }

            if (targetEditionPrice > 0)
            {
                targetEditionPriceForUnusedPeriod = targetEditionPrice * unusedPeriodCount;
                targetEditionPriceForUnusedPeriod += (targetEditionPrice / (int)paymentPeriodType) / numberOfHoursPerDay * unusedHoursCount;
            }

            return targetEditionPriceForUnusedPeriod - currentEditionPriceForUnusedPeriod;
        }

        public async Task<Tenant> UpdateTenantAsync(int tenantId, bool isActive, bool? isInTrialPeriod, PaymentPeriodType? paymentPeriodType, int editionId, EditionPaymentType editionPaymentType)
        {
            var tenant = await FindByIdAsync(tenantId);

            tenant.IsActive = isActive;

            if (isInTrialPeriod.HasValue)
            {
                tenant.IsInTrialPeriod = isInTrialPeriod.Value;
            }

            tenant.EditionId = editionId;

            if (paymentPeriodType.HasValue)
            {
                tenant.UpdateSubscriptionDateForPayment(paymentPeriodType.Value, editionPaymentType);
            }

            return tenant;
        }

        public async Task<EndSubscriptionResult> EndSubscriptionAsync(Tenant tenant, SubscribableEdition edition, DateTime nowUtc)
        {
            if (tenant.EditionId == null || tenant.HasUnlimitedTimeSubscription())
            {
                throw new Exception($"Can not end tenant {tenant.TenancyName} subscription for {edition.DisplayName} tenant has unlimited time subscription!");
            }

            Debug.Assert(tenant.SubscriptionEndDateUtc != null, "tenant.SubscriptionEndDateUtc != null");

            var subscriptionEndDateUtc = tenant.SubscriptionEndDateUtc.Value;
            if (!tenant.IsInTrialPeriod)
            {
                subscriptionEndDateUtc = tenant.SubscriptionEndDateUtc.Value.AddDays(edition.WaitingDayAfterExpire ?? 0);
            }

            if (subscriptionEndDateUtc >= nowUtc)
            {
                throw new Exception($"Can not end tenant {tenant.TenancyName} subscription for {edition.DisplayName} since subscription has not expired yet!");
            }

            if (!tenant.IsInTrialPeriod && edition.ExpiringEditionId.HasValue)
            {
                tenant.EditionId = edition.ExpiringEditionId.Value;
                tenant.SubscriptionEndDateUtc = null;

                await UpdateAsync(tenant);

                return EndSubscriptionResult.AssignedToAnotherEdition;
            }

            tenant.IsActive = false;
            tenant.IsInTrialPeriod = false;

            await UpdateAsync(tenant);

            return EndSubscriptionResult.TenantSetInActive;
        }

        public override Task UpdateAsync(Tenant tenant)
        {
            if (tenant.IsInTrialPeriod && !tenant.SubscriptionEndDateUtc.HasValue)
            {
                throw new UserFriendlyException(LocalizationManager.GetString(OctogoConsts.LocalizationSourceName, "TrialWithoutEndDateErrorMessage"));
            }
            InsertTenantEditionAddonDto input = new InsertTenantEditionAddonDto
            {
                TenantId = tenant.Id,
                EditionId = tenant.EditionId,
                isEdit = true
            };
            InsertUpdateTenantEditionAddonDetails(input);

            return base.UpdateAsync(tenant);
        }

        // Created by : HARI KRASHNA
        // Create ON: 27/12/2021
        // create static role
        public async Task<int> SeedStaticRoles(string Name, int? TenantId)
        {
            if (!_roleManager.RoleExistsAsync(Name).Result)
            {
                Role role = new Role();
                role.Name = Name;
                role.DisplayName = Name;
                role.NormalizedName = Name.ToUpper();
                role.IsStatic = !TenantId.HasValue;
                role.IsDeleted = false;
                role.CreationTime = DateTime.UtcNow;
                role.TenantId = TenantId;
                var roleResult = _roleManager.CreateAsync(role);
                return roleResult.Id;
            }
            return 0;
        }
        public async Task<int> InsertUpdateTenantEditionAddonDetails(InsertTenantEditionAddonDto input)
        {
            SqlParameter[] parameters = new SqlParameter[5];
            parameters[0] = new SqlParameter("TenantId", input.TenantId);
            parameters[1] = new SqlParameter("EditionId", input.EditionId);
            parameters[2] = new SqlParameter("isEdit", input.isEdit);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);
            parameters[4] = new SqlParameter("@AddonIds", null);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_InsertUpdateTenantEditionAddonDetails", parameters
               );
            if (ds.Tables.Count > 0)
            {
                return 1;

            }
            else
            {
                return 0;
            }
        }

        private async Task<User> CheckEmailIdAsync(string emailId)
        {
            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var user = _userRepository.GetAll().Where(x => x.IsDeleted == false && x.EmailAddress.ToLower().Trim().Equals(emailId.ToLower().Trim())).FirstOrDefault();
                if (user != null && user.Id > 0 && user.Id != AbpSession.UserId)
                {
                    var error = LocalizationManager.GetSource(OctogoConsts.LocalizationSourceName).GetString("AdminEmailAddressDuplicate");
                    throw new UserFriendlyException(error);
                }
                return user;
            }
        }
        public string GetUserName(string adminEmailAddress, string tenancyName)
        {
           return adminEmailAddress.Substring(0, adminEmailAddress.IndexOf("@") + 1) + tenancyName.Trim();
        }
    }
}
