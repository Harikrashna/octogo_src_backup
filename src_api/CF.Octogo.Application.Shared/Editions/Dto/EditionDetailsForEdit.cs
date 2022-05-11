using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Editions.Dto
{
    public class EditionDetailsForEdit
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public int? ExpiringEditionId { get; set; }
        public int ApproachId { get; set; }
        public int ProductId { get; set; }
        public int? TrialDayCount { get; set; }
        public bool IsTrialActive { get; set; }
        public int? WaitingDayAfterExpire { get; set; }
        public bool WaitAfterExpiry { get; set; }
        public int? DependantEditionID { get; set; }
        public bool DependantEdition { get; set; }
        public string PricingData { get; set; }
        public int ExpiryNotificationDays { get; set; } // added by : merajuddin 
    }
    public class EditionDetailsForEditDto
    {
        public int? Id { get; set; }
        public string DisplayName { get; set; }
        public int? ExpiringEditionId { get; set; }
        public int ApproachId { get; set; }
        public int ProductId { get; set; }
        public int? TrialDayCount { get; set; }
        public bool IsTrialActive { get; set; }
        public int? WaitingDayAfterExpire { get; set; }
        public bool WaitAfterExpiry { get; set; }
        public int? DependantEditionID { get; set; }
        public bool DependantEdition { get; set; }
        public List<ModulePricingDto> PricingData { get; set; }
        public int expiryNotificationDays { get; set; } // added by : merajuddin
    }
    public class EditionModulesDto
    {
        public List<ModuleDto> ModulesData { get; set; }
        public List<DependEditionDto> DependEditionData { get; set; }
    }
    public class ModuleDto
    {
        public int? ModuleId { get; set; }
        public int? PageModuleId { get; set; }
        public string ModuleName { get; set; }
        public int? SubModuleId { get; set; }
        public string SubModuleName { get; set; }
        public List<ModuleDto> SubModuleList { get; set; }
    }
    public class ModuleRet
    {
        public int? ModuleId { get; set; }
        public int? PageModuleId { get; set; }
        public string ModuleName { get; set; }
        public int? SubModuleId { get; set; }
        public string SubModuleName { get; set; }
        public string SubModuleList { get; set; }
    }
    public class DependEditionRet
    {
        public int EditionId { get; set; }
        public string DisplayName { get; set; }
        public string ModuleData { get; set; }
    }
    public class DependEditionDto
    {
        public int EditionId { get; set; }
        public string DisplayName { get; set; }
        public List<ModuleDto> ModuleData { get; set; }
    }

    public class ModulePricingDto
    {
        public int EditionPricingID { get; set; }
        public int PricingTypeID { get; set; }
        public string PricingTypeName { get; set; }
        public int NoOfDays { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountPercentage { get; set; }
    }
    public class DependentEditionDto
    {
        public int DependantEditionID { get; set; }
        public int EditionId { get; set; }
        public string DisplayName { get; set; }
    }
    public class SubModulesRet
    {
        public int ModuleId { get; set; }
        public string SubModuleList { get; set; }
    }
    public class SubModulesDto
    {
        public int ModuleId { get; set; }
        public List<SubModuleListDto> SubModuleList { get; set; }
    }
    public class SubModuleListDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public List<SubSubModuleListDto> SubSubModuleList { get; set; }
    }
    public class SubSubModuleListDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
    }
    public class PageModulesDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string SubModuleList { get; set; }
    }
    public class ModuleSubModuleDto
    {
        public List<PageModulesDto> ModuleList { get; set; }
        public List<SubModulesDto> SubModuleList { get; set; }
    }
}
