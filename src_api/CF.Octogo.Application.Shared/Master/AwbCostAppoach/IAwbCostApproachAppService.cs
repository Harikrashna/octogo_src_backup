using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Master.AwbPricingAppoach.Dto;
using CF.Octogo.Dto;
using System.Data;
using System.Threading.Tasks;

namespace CF.Octogo.Master.AwbPricingAppoach
{
    public interface IAwbCostApproachAppService : IApplicationService
    {
        Task<PagedResultDto<AwbCostApproachListDto>> GetPerAWBCostApproach(PagedAndSortedInputDto input, string Filter);
        Task<int> CreateOrUpdateAwbCostType(CreateOrUpdateAwbCostApproachInput input);
        Task<CreateOrUpdateAwbCostApproachInput> GetPerAwbCostApproachById(GetEditAwbCostApproachInput input);
        Task DeleteAwbCostApproach(EntityDto input);

    }
}
