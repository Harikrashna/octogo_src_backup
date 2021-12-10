using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Authorization.Users.Dto;
using CF.Octogo.Editions.Dto;

namespace CF.Octogo.Editions
{
    public interface IAddonAppService : IApplicationService
    {
        Task<PagedResultDto<AddonListDto>> GetAddonList(GetAddonInput input);
        Task<ListResultDto<EditionListByProductDto>> GetEditionListForAddon(int ProductId);
        Task<ListResultDto<AddonByEdtionIdDto>> GetAddonListByEditionId(int EditionId);
    }
}
