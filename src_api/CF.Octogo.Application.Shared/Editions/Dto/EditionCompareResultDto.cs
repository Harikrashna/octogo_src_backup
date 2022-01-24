using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Editions.Dto
{
    public class EditionCompareResultDto
    {
        public int EditionID { get; set; }
        public string EditionName { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int TrialDayCount { get; set; }
        public bool IsTrailActive { get; set; }
        public List<EditionModuleList> Modules { get; set; }
        public List<PricingDto> PricingData { get; set; }
        public List<EditionAddonList> AddonList { get; set; }
    }
    public class EditionCompareResultRet
    {
        public int EditionID { get; set; }
        public string EditionName { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int TrialDayCount { get; set; }
        public bool IsTrailActive { get; set; }
        public string Modules { get; set; }
        public string PricingData { get; set; }
        public string AddonList { get; set; }
    }
    public class EditionModuleList
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<SubModuleList> SubModule { get; set; }
    }
    public class SubModuleList
    {
        public int SubModuleID { get; set; }
        public string SubModuleName { get; set; }
        public List<SubModuleList> SubSubModule { get; set; }
    }
    public class PricingDto
    {
        public int PricingTypeId { get; set; }
        public decimal Discount { get; set; }
        public string TypeName { get; set; }
        public int Days { get; set; }
        public decimal Price { get; set; }      
    }
    public class EditionAddonList
    {
        public int AddOnId { get; set; }
        public string AddOnName { get; set; }
        public List<PricingDto> AddonPrice { get; set; }
        public List<AddonModuleList> ModuleList { get; set; }
    }
    public class AddonModuleList
    {
        public int PageId { get; set; }
        public string ModuleName { get; set; }
        public List<AddonSubModules> SubModuleList { get; set; }
    }
    public class AddonSubModules
    {
        public int PageId { get; set; }
        public string SubModuleName { get; set; }
        public List<AddonSubModules> SubSubModuleList { get; set; }
    }

}
