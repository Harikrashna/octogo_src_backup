using System.Collections.Generic;
using Abp.Runtime.Validation;
using CF.Octogo.Dto;


namespace CF.Octogo.Editions.Dto
{
    public class GetAddonInput : PagedAndSortedInputDto
    {
        public string Filter { get; set; }
    }
    public class AddonListDto
    {
        public int? AddonId { get; set; }
        public string AddonName { get; set; }
        public int ModuleId { get; set; }
        public int? ForEditionId { get; set; }
        public string ForEditionName { get; set; }
        public bool IsStandAlone { get; set; }
        public int ProductId { get; set; }
        public string Product { get; set; }
        public bool isFree { get; set; }
        public int ApproachId { get; set; }
        public string Description { get; set; }

    }
    public class AddonModuleAndPricingDto
    {
        public List<ModuleListForEditAddonDto> ModuleList { get; set; }
        public List<ModulePricingDto> PricingData { get; set; }
    }
    public class AddonModuleAndPricingRet
    {
        public string ModuleList { get; set; }
        public string PricingData { get; set; }
    }
    public class ModuleListForAddonRet
    {
        public int ModuleId { get; set; }
        public int PageId { get; set; }
        public string ModuleName { get; set; }
        public int FromEditionId { get; set; }
        public string FromEditionName { get; set; }
        public string SubModuleList { get; set; }
    }
    public class SubModuleForAddonDto
    {
        public int SubModuleId { get; set; }
        public int PageId { get; set; }
        public string SubModuleName { get; set; }
        public List<SubModuleForAddonDto> SubSubModuleList { get; set; } = null;
        
    }
    public class ModuleListForAddonDto
    {
        public int ModuleId { get; set; }
        public int PageId { get; set; }
        public string ModuleName { get; set; }
        public int FromEditionId { get; set; }
        public string FromEditionName { get; set; }
        public List<SubModuleForAddonDto> SubModuleList { get; set; }
    }
    public class ModuleListForEditAddonDto
    {
        public int PageId { get; set; }
        public string ModuleName { get; set; }
        public List<SubModuleForEditAddonDto> SubModuleList { get; set; }
    }
    public class SubModuleForEditAddonDto
    {
        public int PageId { get; set; }
        public string SubModuleName { get; set; }
        public List<SubModuleForEditAddonDto> SubSubModuleList { get; set; } = null;

    }
    public class FeatureListForAddonDto
    {
        
        public string Name { get; set; }

        public string Value { get; set;}
 

    }

}
