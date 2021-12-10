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
        public int? FromEditionId { get; set; }
        public int? ForEditionId { get; set; }
        public string FromEditionName { get; set; }
        public string ForEditionName { get; set; }
        public bool IsStandAlone { get; set; }
        public int ProductId { get; set; }
        public string Product { get; set; }
        public bool isFree { get; set; }
        public int ApproachId { get; set; }
        
    }
    public class AddonByEdtionIdDto
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<ModuleDto> SubModuleList { get; set; }
        public List<ModulePricingDto> PricingData { get; set; }
    }
    public class AddonByEdtionIdRet
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string SubModuleList { get; set; }
        public string PricingData { get; set; }
    }

}
