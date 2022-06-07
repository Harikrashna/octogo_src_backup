using Abp.Auditing;
using Abp.MultiTenancy;
using CF.Octogo.Editions.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CF.Octogo.MultiTenancy.Dto
{
    public class CreateEditTenantInputDto
    {
        public TenantDetailsInputDto TenantDetails { get; set; }
        public List<PackageDetailsInputDto> PackageDetails { get; set; }
        public TransactionDataInputDto TransactionCharges { get; set; }
        public InvoiceDataInputDto InvoiceDetails { get; set; }
        public List<InvoiceDataForEditDto> InvoiceData { get; set; } //Added by: Merajuddin
    }
    public class TenantDetailsInputDto
    {
        public int? TenantId { get; set; }
        public Nullable<int> UserTypeID { get; set; }
        public string ClientName { get; set; }
        public string ClientCode { get; set; }
        public int? AdminUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
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
        public string IsdCode { get; set; }
        public string AdminEmailAddress { get; set; }
        public string AdminPassword { get; set; }

        [MaxLength(AbpTenantBase.MaxConnectionStringLength)]
        [DisableAuditing]
        public string ConnectionString { get; set; }
        public bool UseHostDb { get; set; }
        public bool? SetRandomPassword { get; set; }
        public bool ShouldChangePasswordOnNextLogin { get; set; } = false;
        public bool SendActivationEmail { get; set; } = false;
        public bool IsActive { get; set; }
    }
    public class PackageDetailsInputDto
    {
        public int ProductId { get; set; }
        public int EditionId { get; set; }
        public string ProductName { get; set; }
        public string EditionName { get; set; }
        public int ApproachId { get; set; }
        public bool? WaitAfterExpiry { get; set; }
        public int? WaitingDays { get; set; }
        public bool? AssignAnotherPackage { get; set; }
        public int? AssignPackageId { get; set; }
        public int? PricingTypeId { get; set; }
        public decimal? Amount { get; set; }
        public decimal? DiscountPercentage { get; set; }
        
        public string PaymentModeCode { get; set; }
        public int? PaymentType { get; set; }
        public bool? PaymentDone { get; set; }
        public List<ModuleListDto> ModuleList { get; set; }
        public List<AddonSubscriptionDto> AddonSubscription { get; set; }
    }
    public class CreateEditTenantInputRet
    {
        public string TenantDetails { get; set; }
        public string PackageDetails { get; set; }
        public string TransactionCharges { get; set; }
        public string InvoiceDetails { get; set; }

    }
    public class InvoiceDataInputDto //Added by: merajuddin
    {
        public string LegalName { get; set; }
        public string Address { get; set; }
        public string TaxVatNo { get; set; }

    }
    public class InvoiceDataForEditDto //Added by: Merajuddin
    {
        public string name { get; set; }
        public string Value { get; set; }
    }
    public class Invoicedata
    {
        public string name { get; set; }
        public string Value { get; set; }
    }
}
