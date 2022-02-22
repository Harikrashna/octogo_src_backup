using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.DashboardCustomization.Dto
{
    public class TenantEditionAddonModulesDto
    {
        public int EditionId { get; set; }
        public string EditionName { get; set; }
        public string Price { get; set; }
        public string ProductName { get; set; }
        public string AppURL { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? RemainingDays { get; set; }
        public Boolean? IsSetupProcessComplete { get; set; }
        public List<TenantAddonModulesDto> Addon { get; set; }
        public List<EditionAddonModules> Module { get; set; }
    }
    public class EditionAddonModules
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<EditionAddonModules> SubModule { get; set; }
    }

    public class TenantAddonModulesDto
    {
        public string AddonName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AddonPrice { get; set; }
        public int? RemainingDays { get; set; }
        public List<EditionAddonModules> ModuleList { get; set; }
    }



    public class TenantEditionAddonModulesRet
    {
        public int EditionId { get; set; }
        public string EditionName { get; set; }
        public string Price { get; set; }
        public string ProductName { get; set; }
        public string AppURL { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? RemainingDays { get; set; }
        public Boolean? IsSetupProcessComplete { get; set; }
        public string Addon { get; set; }
        public string Module { get; set; }
    }
}
