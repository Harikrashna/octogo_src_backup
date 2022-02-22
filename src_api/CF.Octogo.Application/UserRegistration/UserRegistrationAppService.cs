using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Notifications;
using CF.Octogo.Authorization.Roles;
using CF.Octogo.Authorization.Users;
using CF.Octogo.Authorization.Users.Dto;
using CF.Octogo.Data;
using CF.Octogo.Notifications;
using CF.Octogo.Url;
using CF.Octogo.UserRegistration.Dto;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.SqlClient;
using System.Linq;
using Abp.Runtime.Security;
using System.Threading.Tasks;
using CF.Octogo.Caching;
using Abp.UI;
using Abp.Application.Services.Dto;
using System.Data;
using Abp.Authorization;
using CF.Octogo.Authorization;

namespace CF.Octogo.UserRegistration
{
    public class UserRegistrationAppService : OctogoAppServiceBase, IUserRegistrationAppService
    {
        public IAppUrlService AppUrlService { get; set; }
        private readonly IEnumerable<IPasswordValidator<User>> _passwordValidators;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly RoleManager _roleManager;
        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;
        private readonly IAppNotifier _appNotifier;
        private readonly IUserEmailer _userEmailer;
        private readonly IRepository<Role> _roleRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly UserManager _userManager;
        public UserRegistrationAppService(IPasswordHasher<User> passwordHasher, 
            IEnumerable<IPasswordValidator<User>> passwordValidators,
            RoleManager roleManager,
            INotificationSubscriptionManager notificationSubscriptionManager,
            IAppNotifier appNotifier,
            IUserEmailer userEmailer,
            IRepository<Role> roleRepository,
            IUnitOfWorkManager unitOfWorkManager,
            UserManager userManager,
            IRepository<User, long> userRepository)
        {
            _passwordValidators = passwordValidators;
            _passwordHasher = passwordHasher;
            _roleManager = roleManager;
            _notificationSubscriptionManager = notificationSubscriptionManager;
            _appNotifier = appNotifier;
            _userEmailer = userEmailer;
            AppUrlService = Url.NullAppUrlService.Instance;
            _roleRepository = roleRepository;
            _unitOfWorkManager = unitOfWorkManager;
            _userManager = userManager;
            _userRepository = userRepository;
        }

        // Disbale UOW to manage transaction manually
        [UnitOfWork(IsDisabled = true)]
        public virtual async Task CreateUserSignUp(UserSignUpInput input)
        {
                User user = new User();
                user.Name = input.FirstName;
                user.Surname = input.LastName;
                user.UserName = input.UserName;
                user.EmailAddress = input.EmailAddress;
                user.IsActive = true;
                user.ShouldChangePasswordOnNextLogin = false;
                user.IsTwoFactorEnabled = true;
                user.IsLockoutEnabled = true;

            

            using (var unitofwork = _unitOfWorkManager.Begin())
            {
                // Added by Hari Krashna(10/02/2022) - for check Email and UserName duplicacy
                await CheckEmailIdAndUserNameAsync(input.EmailAddress, input.UserName);
                if (!input.Password.IsNullOrEmpty())
                {
                    await UserManager.InitializeOptionsAsync(AbpSession.TenantId);
                    foreach (var validator in _passwordValidators)
                    {
                        CheckErrors(await validator.ValidateAsync(UserManager, user, input.Password));
                    }
                    // Pssword Hashing
                    user.Password = _passwordHasher.HashPassword(user, input.Password);
                }

                user.Roles = new Collection<UserRole>();
                // get "User" role  data
                var role = _roleRepository.GetAll().Where(f => f.DisplayName == "User" && f.IsDeleted == false && f.TenantId == null).FirstOrDefault();
                var permission = new Permission(name: AppPermissions.Pages_isdefaultRegisterUser);
                if (role != null && role.Id > 0)
                {
                    if(!_roleManager.IsGranted(role.Id, permission))
                    {
                        _roleManager.GrantPermissionAsync(role, permission);
                    }
                    user.Roles.Add(new UserRole(AbpSession.TenantId, user.Id, role.Id));
                }
                else
                {
                    int roleId = await TenantManager.SeedStaticRoles("User",null);
                    role = _roleRepository.Get(roleId);
                    _roleManager.GrantPermissionAsync(role, permission);
                    user.Roles.Add(new UserRole(AbpSession.TenantId, user.Id, roleId));
                }

                // Create new User
                CheckErrors(await UserManager.CreateAsync(user));
                //CurrentUnitOfWork.SaveChanges(); //To get new user's Id.

                //Notifications
                await _notificationSubscriptionManager.SubscribeToAllAvailableNotificationsAsync(user.ToUserIdentifier());
                await _appNotifier.WelcomeToTheApplicationAsync(user);
                user.SetNewEmailConfirmationCode();
                unitofwork.Complete();      // UOW Transaction completed
            }
            // Insert user-UserType linking
            string UserType = await CreateUserTypeLink((int)user.Id, input.UserTypeId);
            //Send activation email
            _userEmailer.SendUserSignUpEmailActivationLinkAsync(user, UserType,input.UserTypeId, input.Password);
            
        }
        public async Task SendEmailVerificationLink(int userId)
        {
            var res = await GetUserTypeByUserId(userId);
            var  user = UserManager.GetUserById(userId);
            user.SetNewEmailConfirmationCode();
            await _userEmailer.SendUserSignUpEmailActivationLinkAsync(user, res.UserTypeName, res.UserTypeId);
        }

        private async Task<RegisteredUserDetailDto> GetUserRegistrationDetailsByUserId(long userId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserId", userId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_GetRegisteredUserDetailsByUserId", parameters);
            if (ds.Tables.Count > 0)
            {
                return SqlHelper.ConvertDataTable<RegisteredUserDetailDto>(ds.Tables[0]).FirstOrDefault();
            }
            else
            {
                return null;
            }
        }
        private async Task<UserTypeDetailsDto> GetUserTypeByUserId(long userId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("UserId", userId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_GetUserTypeByUserId", parameters);
            if (ds.Tables.Count > 0)
            {
                return SqlHelper.ConvertDataTable<UserTypeDetailsDto>(ds.Tables[0]).FirstOrDefault();
            }
            else
            {
                return null;
            }
        }
        private async Task<string> CreateUserTypeLink(int UserId, int UserTypeId)
        {
            SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter("UserId", UserId);
                parameters[1] = new SqlParameter("UserTypeId", UserTypeId);
                parameters[2] = new SqlParameter("LoginUserId", AbpSession.UserId);
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                            System.Data.CommandType.StoredProcedure,
                            "USP_InsertUserTypeMapping", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return (string)ds.Tables[0].Rows[0]["UserType"];
                }
            return "";
        }
        public async Task<int> CreateDetailedUserRegistration(UserRegistrationInput input)
        {
            if(input.UserTypeId == null || input.UserTypeId == 0)
            {
                // If User fill registartion form after login
                if (input.UserId == 0)
                {
                    input.UserId = (long)AbpSession.UserId;
                }
                var userType = await GetUserTypeByUserId(input.UserId);
                input.UserTypeId = userType.UserTypeId;
            }
            int UserDetailId = 0;
            var hostUser = UserManager.GetUserById(input.UserId);             // get user details for create new Tenant
            if (hostUser == null) 
            {
                throw new UserFriendlyException(L("AbpLoginResultType_UserIsNotActive"));
            }
            if (hostUser != null && hostUser.IsEmailConfirmed == false)
            {
                throw new UserFriendlyException(L("PleaseVerifyMailBeforeRegistrationMessage"));
            }
            // ceheck Registration 
            var res = await GetUserRegistrationDetailsByUserId(hostUser.Id);
            if (res != null && res.UserDetailId > 0)
            {
                throw new UserFriendlyException(L("UserAlreadyRegistered"));
            }

            // Insert User details
            SqlParameter[] parameters = new SqlParameter[17];
            parameters[0] = new SqlParameter("UserTypeId", input.UserTypeId);
            parameters[1] = new SqlParameter("UserId", input.UserId);
            parameters[2] = new SqlParameter("CompanyName", input.Company);
            parameters[3] = new SqlParameter("AirlineId", input.AirlineId);
            parameters[4] = new SqlParameter("DepartmentId", input.DepartmentId);
            parameters[5] = new SqlParameter("Department", input.Department);
            parameters[6] = new SqlParameter("DesignationId", input.DesignationId);
            parameters[7] = new SqlParameter("Designation", input.DesignationId);
            parameters[8] = new SqlParameter("Services", input.Services);
            parameters[9] = new SqlParameter("City", input.City);
            parameters[10] = new SqlParameter("Country", input.Country);
            parameters[11] = new SqlParameter("Contact", input.Contact);
            parameters[12] = new SqlParameter("RepresentingAirlines", input.RepresentingAirlines);
            parameters[13] = new SqlParameter("RepresentingCountries", input.RepresentingCountries);
            parameters[14] = new SqlParameter("IndustryId", input.IndustryId);
            parameters[15] = new SqlParameter("Industry", input.Industry);
            parameters[16] = new SqlParameter("LoginUserId", AbpSession.UserId);

                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                           System.Data.CommandType.StoredProcedure,
                           "USP_CreateUserDetailedRegistration", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    UserDetailId = (int)ds.Tables[0].Rows[0]["UserDetailId"];
                }
            await _userEmailer.SendWelcomeMailToRegisteredUser(hostUser.EmailAddress);
            return UserDetailId;
        }
       
        [UnitOfWork(IsDisabled = true)]
        public async Task<int> CreateTenant(UserRegistrationInput input)
        {
            // Create tenancy data for setup new Tenant
            UserRegistrationTenantInput tenantData = new UserRegistrationTenantInput();
            tenantData.TenancyName = input.Company.Replace(" ", string.Empty);
            tenantData.Name = input.Company;
            //tenantData.AdminEmailAddress = hostUser.EmailAddress;
            //tenantData.AdminPassword = hostUser.Password;
            tenantData.ConnectionString = null;
            tenantData.ShouldChangePasswordOnNextLogin = false;
            tenantData.SendActivationEmail = false;
            tenantData.EditionId = null;
            tenantData.IsActive = true;
            tenantData.IsInTrialPeriod = false;
            int TenantId = await TenantManager.CreateWithAdminUserAsync(tenantData.TenancyName,
                tenantData.Name,
                tenantData.AdminPassword,
                tenantData.AdminEmailAddress,
                tenantData.ConnectionString,
                tenantData.IsActive,
                tenantData.EditionId,
                tenantData.ShouldChangePasswordOnNextLogin,
                tenantData.SendActivationEmail,
                tenantData.SubscriptionEndDateUtc?.ToUniversalTime(),
                tenantData.IsInTrialPeriod,
                AppUrlService.CreateEmailActivationUrlFormat(tenantData.TenancyName)
            );
            if (TenantId > 0)
            {
                // update new Tenent's Admin user password from Host's registered user details
                using (_unitOfWorkManager.Current.SetTenantId(TenantId))        // switch to Tenent's Database
                {
                    var tenantUser = _userRepository.GetAll().FirstOrDefault();             // get Tenant's Admin user details
                   // tenantUser.Password = hostUser.Password;        // set tenent user password from registered host user
                }

                // Deactivate Host's registered user after new tenent creation
                //hostUser.IsDeleted = true;
                //hostUser.DeletionTime = DateTime.UtcNow;
            }
            return TenantId;
        }

        // Added by Hari Krashna(10/02/2022) - for check Email and UserName duplicacy
        private async Task CheckEmailIdAndUserNameAsync(string emailId, string userName)
        {
            using (CurrentUnitOfWork.DisableFilter(AbpDataFilters.MayHaveTenant))
            {
                var user = _userRepository.GetAll().Where(x => x.IsDeleted == false && (x.UserName.ToUpper().Equals(userName.ToUpper())
                                 || x.EmailAddress.ToUpper().Equals(emailId.ToUpper()))).FirstOrDefault();
                if (user != null && user.Id > 0)
                {
                    if (user.EmailAddress.ToUpper().Equals(emailId.ToUpper()))
                    {
                        var error = LocalizationManager.GetSource(OctogoConsts.LocalizationSourceName).GetString("EmailAddressDuplicate");
                        throw new UserFriendlyException(error);
                    }
                    if (user.UserName.ToUpper().Equals(userName.ToUpper()))
                    {
                        var error = LocalizationManager.GetSource(OctogoConsts.LocalizationSourceName).GetString("UserNameAddressDuplicate");
                        throw new UserFriendlyException(error);
                    }
                }
            }
        }
    }
}
