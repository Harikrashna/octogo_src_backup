using Abp.Application.Features;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Localization;
using Abp.Runtime.Session;
using Abp.Timing;
using Abp.UI;
using Abp.Zero.Configuration;
using CF.Octogo.Configuration;
using CF.Octogo.Editions;
using CF.Octogo.Editions.Dto;
using CF.Octogo.Features;
using CF.Octogo.MultiTenancy.Dto;
using CF.Octogo.Notifications;
using CF.Octogo.Security.Recaptcha;
using CF.Octogo.Url;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CF.Octogo.MultiTenancy.Payments;
using Newtonsoft.Json;
using CF.Octogo.Data;
using System.Data.SqlClient;
using CF.Octogo.Authorization.Users;

namespace CF.Octogo.MultiTenancy
{
    public class TenantRegistrationAppService : OctogoAppServiceBase, ITenantRegistrationAppService
    {
        public IAppUrlService AppUrlService { get; set; }

        private readonly IMultiTenancyConfig _multiTenancyConfig;
        private readonly IRecaptchaValidator _recaptchaValidator;
        private readonly EditionManager _editionManager;
        private readonly IAppNotifier _appNotifier;
        private readonly ILocalizationContext _localizationContext;
        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;

        public TenantRegistrationAppService(
            IMultiTenancyConfig multiTenancyConfig,
            IRecaptchaValidator recaptchaValidator,
            EditionManager editionManager,
            IAppNotifier appNotifier,
            ILocalizationContext localizationContext,
            ISubscriptionPaymentRepository subscriptionPaymentRepository)
        {
            _multiTenancyConfig = multiTenancyConfig;
            _recaptchaValidator = recaptchaValidator;
            _editionManager = editionManager;
            _appNotifier = appNotifier;
            _localizationContext = localizationContext;
            _subscriptionPaymentRepository = subscriptionPaymentRepository;

            AppUrlService = NullAppUrlService.Instance;
        }

        public async Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input)
        {
            // Added for Signed Up user - Added By: HARI KRASHNA(17/12/2021)

            // Used to register tenant by SignUp user's Email address
            //User currentUser = new User();
            //if (AbpSession.UserId.HasValue)
            //{
            //    currentUser = checkEmailDuplicacy(input.AdminEmailAddress);
            //}
            if (input.EditionId.HasValue)
            {
                // await CheckEditionSubscriptionAsync(input.EditionId.Value, input.SubscriptionStartType);
                 await CheckEditionSubscriptionNew(input.EditionId.Value, input.SubscriptionStartType);
            }
            else
            {
                await CheckRegistrationWithoutEdition();
            }

            using (CurrentUnitOfWork.SetTenantId(null))
            {
                CheckTenantRegistrationIsEnabled();

                if (UseCaptchaOnRegistration())
                {
                    await _recaptchaValidator.ValidateAsync(input.CaptchaResponse);
                }

                //Getting host-specific settings
                var isActive = await IsNewRegisteredTenantActiveByDefault(input.SubscriptionStartType);
                var isEmailConfirmationRequired = await SettingManager.GetSettingValueForApplicationAsync<bool>(
                    AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin
                );

                DateTime? subscriptionEndDate = null;
                var isInTrialPeriod = false;

                if (input.EditionId.HasValue)
                {
                    isInTrialPeriod = input.SubscriptionStartType == SubscriptionStartType.Trial;

                    if (isInTrialPeriod)
                    {
                        var edition = (SubscribableEdition)await _editionManager.GetByIdAsync(input.EditionId.Value);
                        subscriptionEndDate = Clock.Now.AddDays(edition.TrialDayCount ?? 0);
                    }
                }

                var tenantId = await TenantManager.CreateWithAdminUserAsync(
                    input.TenancyName,
                    input.Name,
                    input.AdminPassword,
                    input.AdminEmailAddress,
                    null,
                    isActive,
                    input.EditionId,
                    shouldChangePasswordOnNextLogin: false,
                    sendActivationEmail: true,
                    subscriptionEndDate,
                    isInTrialPeriod,
                    AppUrlService.CreateEmailActivationUrlFormat(input.TenancyName)
                );

                var tenant = await TenantManager.GetByIdAsync(tenantId);

                // Update Tenant Id of Logged In user
                // Added for Logged In users only
                if (AbpSession.UserId.HasValue)
                {
                    var user = UserManager.GetUserById((long)AbpSession.UserId);             // get user details for update TenantId
                    user.TenantId = tenant.Id;
                    user.LastModificationTime = DateTime.UtcNow;
                    user.LastModifierUserId = user.Id;
                    await CurrentUnitOfWork.SaveChangesAsync();

                    // Used to register tenant by SignUp user's Email address
                    // Deactivate current user if current user is Admin of new Tenant
                    //if (currentUser.EmailAddress.Trim().ToUpper() == input.AdminEmailAddress.Trim().ToUpper())
                    //{
                    //    CheckErrors(await UserManager.DeleteAsync(user));
                    //}
                }
                await _appNotifier.NewTenantRegisteredAsync(tenant);

                return new RegisterTenantOutput
                {
                    TenantId = tenant.Id,
                    TenancyName = input.TenancyName,
                    Name = input.Name,
                    UserName = TenantManager.GetUserName(input.AdminEmailAddress, input.TenancyName),
                    EmailAddress = input.AdminEmailAddress,
                    IsActive = tenant.IsActive,
                    IsEmailConfirmationRequired = isEmailConfirmationRequired,
                    IsTenantActive = tenant.IsActive
                };
            }
        }

        private async Task<bool> IsNewRegisteredTenantActiveByDefault(SubscriptionStartType subscriptionStartType)
        {
            if (subscriptionStartType == SubscriptionStartType.Paid)
            {
                return false;
            }

            return await SettingManager.GetSettingValueForApplicationAsync<bool>(AppSettings.TenantManagement.IsNewRegisteredTenantActiveByDefault);
        }

        private async Task CheckRegistrationWithoutEdition()
        {
            var editions = await _editionManager.GetAllAsync();
            if (editions.Any())
            {
                throw new Exception("Tenant registration is not allowed without edition because there are editions defined !");
            }
        }

        public async Task<EditionsSelectOutput> GetEditionsForSelect()
        {
            var features = FeatureManager
                .GetAll()
                .Where(feature => (feature[FeatureMetadata.CustomFeatureKey] as FeatureMetadata)?.IsVisibleOnPricingTable ?? false);

            var flatFeatures = ObjectMapper
                .Map<List<FlatFeatureSelectDto>>(features)
                .OrderBy(f => f.DisplayName)
                .ToList();

            var editions = (await _editionManager.GetAllAsync())
                .Cast<SubscribableEdition>()
                .OrderBy(e => e.MonthlyPrice)
                .ToList();

            var featureDictionary = features.ToDictionary(feature => feature.Name, f => f);

            var editionWithFeatures = new List<EditionWithFeaturesDto>();
            foreach (var edition in editions)
            {
                editionWithFeatures.Add(await CreateEditionWithFeaturesDto(edition, featureDictionary));
            }

            if (AbpSession.UserId.HasValue)
            {
                var currentEditionId = (await TenantManager.GetByIdAsync(AbpSession.GetTenantId()))
                        .EditionId;

                if (currentEditionId.HasValue)
                {
                    editionWithFeatures = editionWithFeatures.Where(e => e.Edition.Id != currentEditionId).ToList();

                    var currentEdition = (SubscribableEdition) (await _editionManager.GetByIdAsync(currentEditionId.Value));
                    if (!currentEdition.IsFree)
                    {
                        var lastPayment = await _subscriptionPaymentRepository.GetLastCompletedPaymentOrDefaultAsync(
                            AbpSession.GetTenantId(),
                            null,
                            null);

                        if (lastPayment != null)
                        {
                            editionWithFeatures = editionWithFeatures
                                .Where(e =>
                                    e.Edition.GetPaymentAmount(lastPayment.PaymentPeriodType) >
                                    currentEdition.GetPaymentAmount(lastPayment.PaymentPeriodType)
                                )
                                .ToList();
                        }
                    }
                }
            }

            return new EditionsSelectOutput
            {
                AllFeatures = flatFeatures,
                EditionsWithFeatures = editionWithFeatures,
            };
        }

        public async Task<EditionSelectDto> GetEdition(int editionId)
        {
            var edition = await _editionManager.GetByIdAsync(editionId);
            var editionDto = ObjectMapper.Map<EditionSelectDto>(edition);

            return editionDto;
        }

        private async Task<EditionWithFeaturesDto> CreateEditionWithFeaturesDto(SubscribableEdition edition, Dictionary<string, Feature> featureDictionary)
        {
            return new EditionWithFeaturesDto
            {
                Edition = ObjectMapper.Map<EditionSelectDto>(edition),
                FeatureValues = (await _editionManager.GetFeatureValuesAsync(edition.Id))
                    .Where(featureValue => featureDictionary.ContainsKey(featureValue.Name))
                    .Select(fv => new NameValueDto(
                        fv.Name,
                        featureDictionary[fv.Name].GetValueText(fv.Value, _localizationContext))
                    )
                    .ToList()
            };
        }

        private void CheckTenantRegistrationIsEnabled()
        {
            if (!IsSelfRegistrationEnabled())
            {
                throw new UserFriendlyException(L("SelfTenantRegistrationIsDisabledMessage_Detail"));
            }

            if (!_multiTenancyConfig.IsEnabled)
            {
                throw new UserFriendlyException(L("MultiTenancyIsNotEnabled"));
            }
        }

        private bool IsSelfRegistrationEnabled()
        {
            return SettingManager.GetSettingValueForApplication<bool>(AppSettings.TenantManagement.AllowSelfRegistration);
        }

        private bool UseCaptchaOnRegistration()
        {
            return SettingManager.GetSettingValueForApplication<bool>(AppSettings.TenantManagement.UseCaptchaOnRegistration);
        }

        private async Task CheckEditionSubscriptionAsync(int editionId, SubscriptionStartType subscriptionStartType)
        {
            var edition = await _editionManager.GetByIdAsync(editionId) as SubscribableEdition;

            CheckSubscriptionStart(edition, subscriptionStartType);
        }
        private async Task CheckEditionSubscriptionNew(int editionId, SubscriptionStartType subscriptionStartType)
        {
            EditionDetailsForEditDto edition = await GetEditionDetailsById(editionId);

            switch (subscriptionStartType)
            {
                case SubscriptionStartType.Free:
                    if (edition.PricingData != null && edition.PricingData.Count > 0)
                    {
                        throw new UserFriendlyException("This is not a free edition !");
                    }
                    break;
                case SubscriptionStartType.Trial:
                    if (!edition.IsTrialActive)
                    {
                        throw new UserFriendlyException("Trial is not available for this edition !");
                    }
                    break;
                case SubscriptionStartType.Paid:
                    if (edition.PricingData == null)
                    {
                        throw new UserFriendlyException("This is a free edition and cannot be subscribed as paid !");
                    }
                    break;
            }
        }

        private static void CheckSubscriptionStart(SubscribableEdition edition, SubscriptionStartType subscriptionStartType)
        {
            switch (subscriptionStartType)
            {
                case SubscriptionStartType.Free:
                    if (!edition.IsFree)
                    {
                        throw new Exception("This is not a free edition !");
                    }
                    break;
                case SubscriptionStartType.Trial:
                    if (!edition.HasTrial())
                    {
                        throw new Exception("Trial is not available for this edition !");
                    }
                    break;
                case SubscriptionStartType.Paid:
                    if (edition.IsFree)
                    {
                        throw new Exception("This is a free edition and cannot be subscribed as paid !");
                    }
                    break;
            }
        }
        public async Task<EditionsSelectOutput> GetEditionsForSelectForRegisteredUser()
        {
            var features = FeatureManager
                .GetAll()
                .Where(feature => (feature[FeatureMetadata.CustomFeatureKey] as FeatureMetadata)?.IsVisibleOnPricingTable ?? false);

            var flatFeatures = ObjectMapper
                .Map<List<FlatFeatureSelectDto>>(features)
                .OrderBy(f => f.DisplayName)
                .ToList();

            var editions = (await _editionManager.GetAllAsync())
                .Cast<SubscribableEdition>()
                .OrderBy(e => e.MonthlyPrice)
                .ToList();

            var featureDictionary = features.ToDictionary(feature => feature.Name, f => f);

            var editionWithFeatures = new List<EditionWithFeaturesDto>();
            foreach (var edition in editions)
            {
                editionWithFeatures.Add(await CreateEditionWithFeaturesDto(edition, featureDictionary));
            }

            return new EditionsSelectOutput
            {
                AllFeatures = flatFeatures,
                EditionsWithFeatures = editionWithFeatures,
            };
        }
        private User checkEmailDuplicacy(string email)
        {
            var hostUser = UserManager.GetUserById((long)AbpSession.UserId);            
            if (hostUser.EmailAddress.ToUpper() == email.ToUpper() && hostUser.Id != AbpSession.UserId)
            {
                throw new UserFriendlyException(L("AdminEmailAdressDuplicate"));
            }
            return hostUser;
        }

        public async Task<EditionDetailsForEditDto> GetEditionDetailsById(int EditionId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("EditionId", EditionId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetEditionDataForEdit", parameters
                    );
            if (ds.Tables.Count > 0)
            {
                var result = SqlHelper.ConvertDataTable<EditionDetailsForEdit>(ds.Tables[0]);
                return result.Select(rw => new EditionDetailsForEditDto
                {
                    Id = rw.Id,
                    DisplayName = rw.DisplayName,
                    ExpiringEditionId = rw.ExpiringEditionId,
                    ProductId = rw.ProductId,
                    ApproachId = rw.ApproachId,
                    TrialDayCount = rw.TrialDayCount,
                    IsTrialActive = rw.IsTrialActive,
                    WaitingDayAfterExpire = rw.WaitingDayAfterExpire,
                    WaitAfterExpiry = rw.WaitAfterExpiry,
                    DependantEditionID = rw.DependantEditionID,
                    DependantEdition = rw.DependantEdition,
                    PricingData = rw.PricingData != null ? JsonConvert.DeserializeObject<List<ModulePricingDto>>(rw.PricingData.ToString()) : null
                }).FirstOrDefault();
            }
            else
            {
                return null;
            }
        }
    }
}