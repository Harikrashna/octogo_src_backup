using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Addons.Dto
{
    public class AddonCompareResultDto
    {
        public int EditionID { get; set; }
        public string EditionName { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int AddonId { get; set; }
        public string AddonName { get; set; }
        public List<AddonCompareModuleList> ModuleList { get; set; }
        public List<AddonComparePricingDto> PricingData { get; set; }
    }
    public class AddonCompareModuleList
    {
        public int PageId { get; set; }
        public string ModuleName { get; set; }
        public List<AddonCompareSubModules> SubModuleList { get; set; }
    }
    public class AddonCompareSubModules
    {
        public int PageId { get; set; }
        public string SubModuleName { get; set; }
        public List<AddonCompareSubModules> SubSubModuleList { get; set; }
    }
    public class AddonComparePricingDto
    {
        public int AddonPricingID { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string PricingTypeName { get; set; }
        public int NoOfDays { get; set; }
    }
    public class AddonCompareResultRet
    {
        public int EditionID { get; set; }
        public string EditionName { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int AddonId { get; set; }
        public string AddonName { get; set; }
        public string ModuleList { get; set; }
        public string PricingData { get; set; }
    }
}
