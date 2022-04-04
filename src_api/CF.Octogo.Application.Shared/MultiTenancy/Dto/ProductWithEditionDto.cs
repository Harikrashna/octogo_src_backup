using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Dto
{
    /*public class ProductWithEditionList
    {
        public List<ProductWithEditionDto> Product { get; set; }
    }*/
    public class ProductWithEditionRet
    {
        public string ProductName { get; set; }
        public int ProductID { get; set; }
        public string Edition { get; set; }

    }
    public class ProductWithEditionInputDto
    {
        public Nullable<int> IncludeProductId { get; set; }
        public Nullable<int> ExcludeProductId { get; set; }
        public Nullable<int> EditionId { get; set; }
        public Nullable<bool> IsAvailableProduct { get; set; } = false;
        public Nullable<bool> WithStandAloneAddons { get; set; } = false;
    }
    public class ProductWithEditionDto
    {
        public string ProductName { get; set; }
        public int ProductID { get; set; }
        public List<EditionList> Edition { get; set; }

    }
    public class EditionList
    {
        public int EditionID { get; set; }
        public string EditionName { get; set; }

        public int TrialDayCount { get; set; }
        public bool IsDownGraded { get; set; }

        public List<Modules> MODULE { get; set; }
        public List<PricingType> PRICINGTYPE { get; set; }
        public List<AddOn> ADDONS { get; set; }

    }
    public class Modules
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<SubModules> SUBMODULE { get; set; }
    }
    public class SubModules
    {
        public int SubModuleID { get; set; }
        public string SubModuleName { get; set; }
    }
    public class PricingType
    {
        public string Name { get; set; }
        public decimal Discount { get; set; }
        public int Days { get; set; }
        public decimal Price { get; set; }
        public int PricingTypeID { get; set; }
    }
    public class AddOn
    {
        public int AddOnId { get; set; }
        public string AddOnName { get; set; }
        public List<PricingType> ADDONPrice { get; set; }
        public List<AddonModules> ModuleList { get; set; }
        public bool? IsStandAlone { get; set; }
    }
    public class AddonModules
    {
        public int PageId { get; set; }
        public string ModuleName { get; set; }
        public List<AddonSubModuleList> SubModuleList { get; set; }
    }
    public class AddonSubModuleList
    {
        public int PageId { get; set; }
        public string SubModuleName { get; set; }
        public List<AddonSubModuleList> SubSubModuleList { get; set; }
    }

}
