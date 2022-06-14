using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.PricingType.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.PricingType
{
    public interface IPricingTypeAppService : IApplicationService
    {
        Task<PagedResultDto<PricingTypeListDto>> GetPricingType(PricingListInputDto inp);

        Task<int> InsertUpdatePricingType(CreateorUpdatePricingType input);

        Task DeletePricingType(EntityDto input);

        Task<DataSet> GetPricingTypeById(int input);
    }
}
