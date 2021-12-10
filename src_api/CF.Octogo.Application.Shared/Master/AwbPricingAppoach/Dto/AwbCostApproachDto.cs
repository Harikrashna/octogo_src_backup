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
}
