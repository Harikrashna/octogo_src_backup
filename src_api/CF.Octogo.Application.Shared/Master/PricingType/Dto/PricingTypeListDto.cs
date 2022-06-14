using Abp.Application.Services.Dto;
using Abp.Runtime.Validation;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CF.Octogo.Master.PricingType.Dto
{
    public class CreateorUpdatePricingType
    {

        public Nullable<int> inPricingTypeId { get; set; }
        public string vcTypeName { get; set; }

        public int inNoOfDays { get; set; }
    }

    public class GetEditInput
    {
        public int inPricingTypeId { get; set; }
    }

    public class PricingTypeListRet
    {
        public int PricingTypeId { get; set; }
        public string TypeName { get; set; }

        public int NoOfDays { get; set; }
        public int TotalCount { get; set; }
    }
    public class PricingTypeListDto
    {
        public int inPricingTypeId { get; set; }
        public string vcTypeName { get; set; }

        public int inNoOfDays { get; set; }
    }
    public class PricingListInputDto : PagedAndSortedInputDto, IShouldNormalize
    {
        public string filter { get; set; }
        public void Normalize()
        {
            filter = filter?.Trim();
        }

    }

}
