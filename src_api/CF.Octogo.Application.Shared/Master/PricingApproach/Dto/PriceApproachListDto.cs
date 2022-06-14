using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.PricingApproach.Dto
{
    public class PriceApproachListDto
    {
        public int Id { get; set; }
        public string ApproachName { get; set; }

        public string Description { get; set; }

    }
    public class PriceApproachListRet
    {
        public int Id { get; set; }
        public string ApproachName { get; set; }

        public string Description { get; set; }

        public int TotalCount { get; set; }
    }
}
