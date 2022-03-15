using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Editions.Dto
{
    public class AvailableAddonModulesDto
    {
        public int AddonId { get; set; }
        public string AddonName { get; set; }
        public int EditionId { get; set; }

        public List<AvailableModuleDto> ModuleList { get; set; }
        public List<PricingDataDto> PricingData { get; set; }

    }
    public class AvailableModuleDto
    {
       public string ModuleName { get; set; }
       public List<AvailableModuleDto> SubModule { get; set; }
    }
    public class AvailableModules
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<AvailableModules> SubModule { get; set; }
    }
    public class PricingDataDto
    {
        public int AddonPricingID { get; set; }
        public int PricingTypeID { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string PricingTypeName { get; set; }
        public int NoOfDays { get; set; }
    }
    public class AvailableAddonModulesRet
    {
        public int AddonId { get; set; }
        public string AddonName { get; set; }
        public int EditionId { get; set; }
        public string ModuleList { get; set; }
        public string PricingData { get; set; }

    }
}
