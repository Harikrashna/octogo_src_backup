using Abp.Runtime.Validation;
using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.PricingApproach.Dto
{
    public class CreateOrUpdatePriceApproachDto: IShouldNormalize
    {
        public int? ApproachId { get; set; }
        public string ApproachName { get; set; }
        public string Description { get; set; }
        public void Normalize()
        {
            ApproachName = ApproachName.Trim();
        }
    }
}
