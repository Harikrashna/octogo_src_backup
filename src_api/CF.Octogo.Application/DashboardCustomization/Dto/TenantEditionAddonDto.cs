using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.DashboardCustomization.Dto
{
    public class TenantEditionAddonDto
    {
        public int EditionId { get; set; }
        public int ProductId { get; set; }
        
        public string EditionName { get; set; }
        public string Price { get; set; }
        public string ProductName { get; set; }
        public string AppURL { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? RemainingDays { get; set; }
        public Boolean? IsSetupProcessComplete { get; set; }
        public List<SubscribedAddonDto> Addon { get; set; }
        public int ExpiryNotificationDays { get; set; } // added by: merajuddin
    }
    public class TenantSubscriotionsDto
    {
        public List<TenantEditionAddonDto> TenantEditionAddon { get; set; }
        public List<SubscribedStandAloneAddonDto> StandAloneAddon { get; set; }
    }
    public class SubscribedAddonDto
    {
        public string AddonName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AddonPrice { get; set; }
    
    }
    public class TenantEditionAddonRet
    {
        public int EditionId { get; set; }
        public int ProductId { get; set; }
        public string EditionName { get; set; }
        public string Price { get; set; }
        public string ProductName { get; set; }
        public string AppURL { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? RemainingDays { get; set; }
        public Boolean? IsSetupProcessComplete { get; set; }
        public string Addon { get; set; }
        public int ExpiryNotificationDays { get; set; } // added by merajuddin
    }
    public class SubscribedStandAloneAddonRet
    {
        public string AddonName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AddonPrice { get; set; }
        public string ModuleList { get; set; }
        public int? RemainingDays { get; set; }
    }
    public class SubscribedStandAloneAddonDto
    {
        public string AddonName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AddonPrice { get; set; }
        public List<StandAloneAddonModulesDto> ModuleList { get; set; }
        public int? RemainingDays { get; set; }
    }
    public class StandAloneAddonModulesDto
    {
        public string ModuleName { get; set; }
        public List<StandAloneAddonModulesDto> SubModule { get; set; }
    }

}
