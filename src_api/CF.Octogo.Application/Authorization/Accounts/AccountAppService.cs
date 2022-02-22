using System;
using System.Threading.Tasks;
using System.Web;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Runtime.Security;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Zero.Configuration;
using Microsoft.AspNetCore.Identity;
using CF.Octogo.Authorization.Accounts.Dto;
using CF.Octogo.Authorization.Impersonation;
using CF.Octogo.Authorization.Users;
using CF.Octogo.Configuration;
using CF.Octogo.Debugging;
using CF.Octogo.MultiTenancy;
using CF.Octogo.Security.Recaptcha;
using CF.Octogo.Url;
using CF.Octogo.Authorization.Delegation;
using Abp.Domain.Repositories;
using CF.Octogo.MultiTenancy.Payments;
using CF.Octogo.Editions;
using Abp.Domain.Uow;

namespace CF.Octogo.Authorization.Accounts
{
    public class AccountAppService : OctogoAppServiceBase, IAccountAppService
    {
        public IAppUrlService AppUrlService { get; set; }

        public IRecaptchaValidator RecaptchaValidator { get; set; }

        private readonly IUserEmailer _userEmailer;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IImpersonationManager _impersonationManager;
        private readonly IUserLinkManager _userLinkManager;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IWebUrlService _webUrlService;
        private readonly IUserDelegationManager _userDelegationManager;
        private readonly ITenantRegistrationAppService _tenantRegistrationAppService;
        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;
        private readonly IEditionAppService _editionAppService;
        public AccountAppService(
            IUserEmailer userEmailer,
            UserRegistrationManager userRegistrationManager,
            IImpersonationManager impersonationManager,
            IUserLinkManager userLinkManager,
            IPasswordHasher<User> passwordHasher,
            IWebUrlService webUrlService, 
            IUserDelegationManager userDelegationManager,
            ITenantRegistrationAppService tenantRegistrationAppService,
            ISubscriptionPaymentRepository subscriptionPaymentRepository,
            IEditionAppService editionAppService)
        {
            _userEmailer = userEmailer;
            _userRegistrationManager = userRegistrationManager;
            _impersonationManager = impersonationManager;
            _userLinkManager = userLinkManager;
            _passwordHasher = passwordHasher;
            _webUrlService = webUrlService;

            AppUrlService = NullAppUrlService.Instance;
            RecaptchaValidator = NullRecaptchaValidator.Instance;
            _userDelegationManager = userDelegationManager;
            _tenantRegistrationAppService = tenantRegistrationAppService;
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _editionAppService = editionAppService;
        }

        public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
        {
            var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
            if (tenant == null)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.NotFound);
            }

            if (!tenant.IsActive)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.InActive);
            }

            return new IsTenantAvailableOutput(TenantAvailabilityState.Available, tenant.Id, _webUrlService.GetServerRootAddress(input.TenancyName));
        }

        public Task<int?> ResolveTenantId(ResolveTenantIdInput input)
        {
            if (string.IsNullOrEmpty(input.c))
            {
                return Task.FromResult(AbpSession.TenantId);
            }

            var parameters = SimpleStringCipher.Instance.Decrypt(input.c);
            var query = HttpUtility.ParseQueryString(parameters);

            if (query["tenantId"] == null)
            {
                return Task.FromResult<int?>(null);
            }

            var tenantId = Convert.ToInt32(query["tenantId"]) as int?;
            return Task.FromResult(tenantId);
        }

        public async Task<RegisterOutput> Register(RegisterInput input)
        {
            if (UseCaptchaOnRegistration())
            {
                await RecaptchaValidator.ValidateAsync(input.CaptchaResponse);
            }

            var user = await _userRegistrationManager.RegisterAsync(
                input.Name,
                input.Surname,
                input.EmailAddress,
                input.UserName,
                input.Password,
                false,
                AppUrlService.CreateEmailActivationUrlFormat(AbpSession.TenantId)
            );

            var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);

            return new RegisterOutput
            {
                CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin)
            };
        }

        public async Task SendPasswordResetCode(SendPasswordResetCodeInput input)
        {
            var user = await GetUserByChecking(input.EmailAddress);
            user.SetNewPasswordResetCode();
            await _userEmailer.SendPasswordResetLinkAsync(
                user,
                AppUrlService.CreatePasswordResetUrlFormat(AbpSession.TenantId)
                );
        }

        public async Task<ResetPasswordOutput> ResetPassword(ResetPasswordInput input)
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var user = await UserManager.GetUserByIdAsync(input.UserId);
                if (user == null || user.PasswordResetCode.IsNullOrEmpty() || user.PasswordResetCode != input.ResetCode)
                {
                    throw new UserFriendlyException(L("InvalidPasswordResetCode"), L("InvalidPasswordResetCode_Detail"));
                }

                await UserManager.InitializeOptionsAsync(AbpSession.TenantId);
                CheckErrors(await UserManager.ChangePasswordAsync(user, input.Password));
                user.PasswordResetCode = null;
                user.IsEmailConfirmed = true;
                user.ShouldChangePasswordOnNextLogin = false;

                await UserManager.UpdateAsync(user);

                return new ResetPasswordOutput
                {
                    CanLogin = user.IsActive,
                    UserName = user.UserName
                };
            }
        }

        public async Task SendEmailActivationLink(SendEmailActivationLinkInput input)
        {
            var user = await GetUserByChecking(input.EmailAddress);
            user.SetNewEmailConfirmationCode();
            await _userEmailer.SendEmailActivationLinkAsync(
                user,
                AppUrlService.CreateEmailActivationUrlFormat(AbpSession.TenantId)
            );
        }

        public async Task ActivateEmail(ActivateEmailInput input)
        {
            var user = await UserManager.GetUserByIdAsync(input.UserId);
            if (user != null && user.IsEmailConfirmed)
            {
                return;
            }

            if (user == null || user.EmailConfirmationCode.IsNullOrEmpty() || user.EmailConfirmationCode != input.ConfirmationCode)
            {
                throw new UserFriendlyException(L("InvalidEmailConfirmationCode"), L("InvalidEmailConfirmationCode_Detail"));
            }

            user.IsEmailConfirmed = true;
            user.EmailConfirmationCode = null;

            await UserManager.UpdateAsync(user);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Users_Impersonation)]
        public virtual async Task<ImpersonateOutput> Impersonate(ImpersonateInput input)
        {
            return new ImpersonateOutput
            {
                ImpersonationToken = await _impersonationManager.GetImpersonationToken(input.UserId, input.TenantId),
                TenancyName = await GetTenancyNameOrNullAsync(input.TenantId)
            };
        }

        public virtual async Task<ImpersonateOutput> DelegatedImpersonate(DelegatedImpersonateInput input)
        {
            var userDelegation = await _userDelegationManager.GetAsync(input.UserDelegationId);
            if (userDelegation.TargetUserId != AbpSession.GetUserId())
            {
                throw new UserFriendlyException("User delegation error.");
            }

            return new ImpersonateOutput
            {
                ImpersonationToken = await _impersonationManager.GetImpersonationToken(userDelegation.SourceUserId, userDelegation.TenantId),
                TenancyName = await GetTenancyNameOrNullAsync(userDelegation.TenantId)
            };
        }

        public virtual async Task<ImpersonateOutput> BackToImpersonator()
        {
            return new ImpersonateOutput
            {
                ImpersonationToken = await _impersonationManager.GetBackToImpersonatorToken(),
                TenancyName = await GetTenancyNameOrNullAsync(AbpSession.ImpersonatorTenantId)
            };
        }

        public virtual async Task<SwitchToLinkedAccountOutput> SwitchToLinkedAccount(SwitchToLinkedAccountInput input)
        {
            if (!await _userLinkManager.AreUsersLinked(AbpSession.ToUserIdentifier(), input.ToUserIdentifier()))
            {
                throw new Exception(L("This account is not linked to your account"));
            }

            return new SwitchToLinkedAccountOutput
            {
                SwitchAccountToken = await _userLinkManager.GetAccountSwitchToken(input.TargetUserId, input.TargetTenantId),
                TenancyName = await GetTenancyNameOrNullAsync(input.TargetTenantId)
            };
        }

        private bool UseCaptchaOnRegistration()
        {
            return SettingManager.GetSettingValue<bool>(AppSettings.UserManagement.UseCaptchaOnRegistration);
        }

        private async Task<Tenant> GetActiveTenantAsync(int tenantId)
        {
            var tenant = await TenantManager.FindByIdAsync(tenantId);
            if (tenant == null)
            {
                throw new UserFriendlyException(L("UnknownTenantId{0}", tenantId));
            }

            if (!tenant.IsActive)
            {
                throw new UserFriendlyException(L("TenantIdIsNotActive{0}", tenantId));
            }

            return tenant;
        }

        private async Task<string> GetTenancyNameOrNullAsync(int? tenantId)
        {
            return tenantId.HasValue ? (await GetActiveTenantAsync(tenantId.Value)).TenancyName : null;
        }

        private async Task<User> GetUserByChecking(string inputEmailAddress)
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var user = await UserManager.FindByEmailAsync(inputEmailAddress);
                if (user == null)
                {
                    throw new UserFriendlyException(L("InvalidEmailAddress"));
                }

                return user;
            }
        }
        /// <summary>
        /// desc:This service is used to find payment deatils and availibility of tenant
        /// created by:Merajuddin khan
        /// created on:03-01-2022
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<CheckPaymentAvailabiltyDto> CheckPaymentAndAvailibility(IsTenantAvailableInput input)
        {
            var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
            if (tenant == null)
            {
                return new CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability.NotFound);
            }
            //var tenantEditionInfo = await _tenantRegistrationAppService.GetEdition((int)tenant.EditionId);
            var tenantEditionInfo = await _editionAppService.GetEditionDetailsForEdit((int)tenant.EditionId);

            var paymentCompleteInfo = await _subscriptionPaymentRepository.GetLastCompletedPaymentOrDefaultAsync(
                   tenantId: tenant.Id,
                   gateway: null,
                   isRecurring: null);
            if (tenantEditionInfo.PricingData == null)
            {

                return new CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability.isFree, tenant.Id, _webUrlService.GetServerRootAddress(input.TenancyName));
            }

            if (paymentCompleteInfo == null)
            {

                return new CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability.NotCompleted, tenant.Id, _webUrlService.GetServerRootAddress(input.TenancyName), tenant.EditionId);
            }

            return new CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability.Completed, tenant.Id, _webUrlService.GetServerRootAddress(input.TenancyName));
        }
    }
}