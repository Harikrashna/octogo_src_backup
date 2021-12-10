using Abp.Runtime.Validation;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Text;
namespace CF.Octogo.Master.PricingApproach.Dto
{
    public class GetPriceApproachInput : PagedAndSortedInputDto, IShouldNormalize
    {

        public string filter { get; set; }

        public void Normalize()
        {
            //if (string.IsNullOrEmpty(filter))
            //{
            //    filter = "";
            //}

            filter = filter?.Trim();
        }
    }
}
