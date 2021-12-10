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
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        public UserRegistrationAppService(IPasswordHasher<User> passwordHasher, 
            IEnumerable<IPasswordValidator<User>> passwordValidators,
            RoleManager roleManager,
            INotificationSubscriptionManager notificationSubscriptionManager,
            IAppNotifier appNotifier,
            IUserEmailer userEmailer,
            IRepository<Role> roleRepository,
            IUnitOfWorkManager unitOfWorkManager)
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
        }

        [UnitOfWork(IsDisabled = true)]
        public virtual async Task CreateUserSignUp(UserSignUpInput input)
        {
                User user = new User();
                user.Name = input.FirstName;
                user.Surname = input.LastName;
                user.UserName = input.EmailAddress;
                user.EmailAddress = input.EmailAddress;
                user.IsActive = true;
                user.ShouldChangePasswordOnNextLogin = false;
                user.IsTwoFactorEnabled = true;
                user.IsLockoutEnabled = true;
            //user.TenantId = null;

            //Set password
            //if (input.SetRandomPassword)
            //{
            //    var randomPassword = await _userManager.CreateRandomPassword();
            //    user.Password = _passwordHasher.HashPassword(user, randomPassword);
            //    input.User.Password = randomPassword;
            //}
            using (var unitofwork = _unitOfWorkManager.Begin())
            {
                if (!input.Password.IsNullOrEmpty())
                {
                    await UserManager.InitializeOptionsAsync(AbpSession.TenantId);
                    foreach (var validator in _passwordValidators)
                    {
                        CheckErrors(await validator.ValidateAsync(UserManager, user, input.Password));
                    }

                    user.Password = _passwordHasher.HashPassword(user, input.Password);
                }

                //Assign roles
                user.Roles = new Collection<UserRole>();
                var role = _roleRepository.GetAll().Where(f => f.DisplayName == "User" && f.IsDeleted == false && f.TenantId == null).FirstOrDefault();
                user.Roles.Add(new UserRole(AbpSession.TenantId, user.Id, role.Id));


                CheckErrors(await UserManager.CreateAsync(user));
                //CurrentUnitOfWork.SaveChanges(); //To get new user's Id.

                //Notifications
                await _notificationSubscriptionManager.SubscribeToAllAvailableNotificationsAsync(user.ToUserIdentifier());
                await _appNotifier.WelcomeToTheApplicationAsync(user);
                user.SetNewEmailConfirmationCode();
                unitofwork.Complete();
            }
            string UserType = await CreateUserTypeLink((int)user.Id, input.UserTypeId);
            //Send activation email
            await _userEmailer.SendUserSignUpEmailActivationLinkAsync(user, input.UserTypeId, UserType, input.Password);
            
        }
        private async Task<string> CreateUserTypeLink(int UserId, int UserTypeId)
        {
            SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter("UserId", UserId);
                parameters[1] = new SqlParameter("UserTypeId", UserTypeId);
                parameters[2] = new SqlParameter("LoginUserId", AbpSession.UserId);
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                            System.Data.CommandType.StoredProcedure,
                            "InsertUserTypeLinking", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return (string)ds.Tables[0].Rows[0]["UserType"];
                }
            return "";
        }
        public async Task<int> CreateDetailedUserRegistration(UserRegistrationInput input)
        {
            int TenentId = 0;
            string ServerName = "localhost";
            string DatabaseName = input.Company;
            string ConnectionString = "Server="+ ServerName + "; Database="+ DatabaseName + "; Trusted_Connection=True;";
            SqlParameter[] parameters = new SqlParameter[18];
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
            parameters[16] = new SqlParameter("ConnectionString", SimpleStringCipher.Instance.Encrypt(ConnectionString));
            parameters[17] = new SqlParameter("LoginUserId", AbpSession.UserId);
            try
            {
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                            System.Data.CommandType.StoredProcedure,
                            "USP_CreateUserDetailedRegistration", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    TenentId = (int)ds.Tables[0].Rows[0]["TenentId"];
                    await CreateDataBase(DatabaseName, ConnectionString);
                }
            }catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return TenentId;
        }
        private async Task CreateDataBase(string dbName, string connectionString)
        {
            SqlHelper.ExecuteNonQuery(Connection.GetSqlConnection("localhost"),
                System.Data.CommandType.Text,
                "CREATE DATABASE " + dbName);
        }
    }
}
