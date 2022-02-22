﻿using System;
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
    }

}