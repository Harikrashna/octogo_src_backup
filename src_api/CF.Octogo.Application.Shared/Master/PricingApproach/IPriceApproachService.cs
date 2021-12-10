using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.PricingApproach.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.PricingApproach
{
    public interface IPriceApproachService : IApplicationService
    {
        Task<PagedResultDto<PriceApproachListDto>> GetPricingApproach(GetPriceApproachInput input);
    }
}
