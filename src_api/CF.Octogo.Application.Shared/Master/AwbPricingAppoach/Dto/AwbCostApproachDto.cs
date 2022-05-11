using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.AwbPricingAppoach.Dto
{
    public class CreateOrUpdateAwbCostApproachInput
    {
        public Nullable<int> inApproachID { get; set; }
        public string vcApproachName { get; set; }
        public string vcDescription { get; set; }
        public string Filter { get; set; }
        public List<AwbCostApproachDto> AWBCostAppraochData { get; set; }
    }
    public class AwbCostApproachDto
    {
        public Nullable<int> inPerAWBCostID { get; set; }
        public int CountMin { get; set; }
        public int CountMax { get; set; }
        public decimal BillingRate { get; set; }
        public decimal Amount { get; set; }

    }
    public class GetEditAwbCostApproachInput
    {
        public int inApproachID { get; set; }
    }
    public class AwbCostApproachListDto
    {
        public int inApproachID { get; set; }
        public string vcApproachName { get; set; }
        public string vcDescription { get; set; }
    }
    public class CreateOrUpdateAwbCostApproachInputRet
    {
        public Nullable<int> inApproachID { get; set; }
        public string vcApproachName { get; set; }
        public string vcDescription { get; set; }
        public string AWBCostAppraochData { get; set; }
    }
    public class AwbCostApproachDtoRet
    {
        public Nullable<int> inApproachID { get; set; }
        public int CountMin { get; set; }
        public int CountMax { get; set; }
        public decimal BillingRate { get; set; }
        public decimal Amount { get; set; }

    }
}
