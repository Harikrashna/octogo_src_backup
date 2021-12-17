using Abp.Auditing;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using CF.Octogo.MultiTenancy;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CF.Octogo.UserRegistration.Dto
{
    public class UserSignUpInput
    {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string EmailAddress { get; set; }
            public string UserName { get; set; }
            public string Password { get; set; }
            public int UserTypeId { get; set; }
    }
    public class UserRegistrationInput
    {
        public int? UserTypeId { get; set; }
        public long UserId { get; set; }
        public string Company { get; set; }
        public int AirlineId { get; set; }
        public int DepartmentId { get; set; }
        public string Department { get; set; }
        public int DesignationId { get; set; }
        public string Designation { get; set; }
        public string Services { get; set; }
        public int City { get; set; }
        public int Country { get; set; }
        public string Contact { get; set; }
        public string RepresentingAirlines { get; set; }
        public string RepresentingCountries { get; set; }
        public int IndustryId { get; set; }
        public string Industry { get; set; }
        public int LoginUserId { get; set; }
        public string IsdCode { get; set; }
    }
    public class UserRegistrationTenantInput
    {
        [Required]
        [StringLength(AbpTenantBase.MaxTenancyNameLength)]
        [RegularExpression(TenantConsts.TenancyNameRegex)]
        public string TenancyName { get; set; }

        [Required]
        [StringLength(TenantConsts.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string AdminEmailAddress { get; set; }

        [StringLength(AbpUserBase.MaxPasswordLength)]
        [DisableAuditing]
        public string AdminPassword { get; set; }

        [MaxLength(AbpTenantBase.MaxConnectionStringLength)]
        [DisableAuditing]
        public string ConnectionString { get; set; }

        public bool ShouldChangePasswordOnNextLogin { get; set; }

        public bool SendActivationEmail { get; set; }

        public int? EditionId { get; set; }

        public bool IsActive { get; set; }

        public DateTime? SubscriptionEndDateUtc { get; set; }

        public bool IsInTrialPeriod { get; set; }
    }
    public class RegisteredUserDetailDto
    {
        public long UserDetailId { get; set; }
        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }
    }
    public class UserTypeDetailsDto
    {
        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }
    }

}
