using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Editions.Dto
{
    public class CreateAddonDto
    {
        public string AddonName { get; set; }
        public int EditionID { get; set; }
        public int ProductId { get; set; }
        public int ApproachId { get; set; }
        public bool IsStandAlone { get; set; } = false;
        public int? AddonId { get; set; }
        public string Description { get; set; }
        public List<AddonModulesDto> ModuleList { get; set; }
        public List<PriceDiscount> priceDiscount { get; set; } = null;
    }
    public class AddonModulesDto
    {
        public int? EditionModuleId { get; set; }
        public int PageModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<AddonSubListDto> SubModuleList { get; set; }
    }
    public class AddonSubListDto
    {
        public int? EditionModuleId { get; set; }
        public int PageModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<AddonSubListDto> SubModuleList { get; set; }
    }
}
